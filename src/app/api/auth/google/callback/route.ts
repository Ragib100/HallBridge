import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
  picture?: string;
};

type StateData = {
  nonce: string;
  signup: boolean;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const origin = url.origin;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_oauth_failed`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_oauth_failed`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("hb_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_oauth_failed`);
  }

  // Parse the state to get signup flag
  let isSignup = false;
  try {
    const stateData: StateData = JSON.parse(
      Buffer.from(state, "base64url").toString()
    );
    isSignup = stateData.signup;
  } catch {
    // If state parsing fails, default to login flow
  }

  // Clear the OAuth state cookie
  cookieStore.set({
    name: "hb_oauth_state",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_oauth_failed`);
  }

  // Get user info from Google
  const userInfoResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;
  const email = userInfo.email?.toLowerCase();
  const name = userInfo.name;

  if (!email) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_missing_email`);
  }

  await connectDB();

  let user = await User.findOne({ email });

  // Handle sign-up flow
  if (!user && isSignup) {
    // Create new student account
    user = await User.create({
      fullName: name || email.split("@")[0],
      email,
      passwordHash: "", // No password for Google-only accounts
      userType: "student",
      isActive: false, // Pending approval like regular registrations
      googleId: email, // Store for reference
    });

    // Redirect to login with success message
    return NextResponse.redirect(
      `${origin}/auth/login?message=google_signup_success`
    );
  }

  // Handle login flow - user must exist
  if (!user) {
    const redirectPage = isSignup ? "register" : "login";
    return NextResponse.redirect(
      `${origin}/auth/${redirectPage}?error=google_account_not_found`
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=google_account_pending`
    );
  }

  // Determine redirect path based on user type
  const redirectPath =
    user.userType === "student"
      ? "/dashboard/student/home"
      : user.userType === "staff"
        ? "/dashboard/staff"
        : "/dashboard/admin";

  const response = NextResponse.redirect(`${origin}${redirectPath}`);

  // Set session cookie
  response.cookies.set({
    name: "hb_session",
    value: user._id.toString(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
