import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { message: "Google OAuth is not configured" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const isSignup = url.searchParams.get("signup") === "true";
  const origin = url.origin;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  // Generate state with signup flag embedded
  const stateData = {
    nonce: crypto.randomBytes(16).toString("hex"),
    signup: isSignup,
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString("base64url");

  const cookieStore = await cookies();
  cookieStore.set({
    name: "hb_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "offline",
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
