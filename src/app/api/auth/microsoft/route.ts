import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(req: Request) {
    const clientId = process.env.MICROSOFT_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json(
            { message: "Microsoft OAuth is not configured" },
            { status: 500 }
        );
    }

    const url = new URL(req.url);
    const origin = url.origin;
    const redirectUri =
        process.env.MICROSOFT_REDIRECT_URI || `${origin}/api/auth/microsoft/callback`;

    // Generate state for CSRF protection
    const stateData = {
        nonce: crypto.randomBytes(16).toString("hex"),
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
        scope: "User.Read",
        prompt: "select_account",
        state,
    });

    return NextResponse.redirect(
        `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`
    );
}