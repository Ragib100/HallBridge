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

  cookieStore.set({
    name: "hb_oauth_state",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

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

  if (!email) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_missing_email`);
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=google_account_not_found`
    );
  }

  const redirectPath =
    user.userType === "student"
      ? "/dashboard/student/home"
      : user.userType === "staff"
        ? "/dashboard/staff"
        : "/dashboard/admin";

  const response = NextResponse.redirect(`${origin}${redirectPath}`);

  response.cookies.set({
    name: "hb_session",
    value: user._id.toString(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
