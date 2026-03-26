import { NextRequest, NextResponse } from "next/server";
import { findOrCreateOAuthUser, createToken } from "@/lib/db";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "Google OAuth not configured.",
        message:
          "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables. " +
          "Get these from https://console.cloud.google.com/apis/credentials",
      },
      { status: 500 },
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_denied", req.url));
  }

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("Google user info failed:", userData);
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    const { id: googleId, name, email } = userData;

    // Find or create user
    const user = findOrCreateOAuthUser("google", googleId, name || email, email);
    const token = createToken(user.id);

    // Redirect to onboarding if new user (no path chosen), otherwise dashboard
    const destination = user.chosenPath ? "/dashboard" : "/onboarding";
    const response = NextResponse.redirect(new URL(destination, req.url));
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
}
