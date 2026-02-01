import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";

type MicrosoftTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

type MicrosoftUserInfo = {
  mail?: string;
  userPrincipalName?: string;
  displayName?: string;
  picture?: string;
};

type StateData = {
  nonce: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  const origin = url.origin;
  const redirectUri =
    process.env.MICROSOFT_REDIRECT_URI || `${origin}/api/auth/microsoft/callback`;
    
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("hb_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
  }

  // Verify state for CSRF protection
  try {
    JSON.parse(Buffer.from(state, "base64url").toString()) as StateData;
  } catch {
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
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
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData: MicrosoftTokenResponse = await tokenResponse.json();

  if (tokenData.error || !tokenData.access_token) {
    console.error("Microsoft token exchange failed:", tokenData.error, tokenData.error_description);
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
  }

  // Fetch user info
  const userInfoResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const userInfoData = await userInfoResponse.json() as MicrosoftUserInfo;

  // Microsoft Graph returns email in 'mail' field (can be null) or 'userPrincipalName'
  const email = userInfoData.mail || userInfoData.userPrincipalName;

  if (!userInfoResponse.ok || !email) {
    console.error("Microsoft user info failed:", userInfoResponse.status, userInfoData);
    return NextResponse.redirect(`${origin}/auth/login?error=microsoft_oauth_failed`);
  }

  await connectDB();

  const user = await User.findOne({ email });

  // User must exist - no signup via OAuth
  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=microsoft_account_not_found`
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=microsoft_account_pending`
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