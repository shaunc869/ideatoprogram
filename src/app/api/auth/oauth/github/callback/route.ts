import { NextRequest, NextResponse } from "next/server";
import { findOrCreateOAuthUser, createToken } from "@/lib/db";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "GitHub OAuth not configured.",
        message:
          "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables. " +
          "Get these from https://github.com/settings/developers",
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
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("GitHub user info failed:", userData);
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    // Get primary email if not public
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      });
      const emails = await emailResponse.json();
      const primary = emails.find(
        (e: { primary: boolean; verified: boolean; email: string }) =>
          e.primary && e.verified,
      );
      email = primary?.email || emails[0]?.email;
    }

    const { id: githubId, name, login } = userData;

    // Find or create user
    const user = findOrCreateOAuthUser(
      "github",
      String(githubId),
      name || login,
      email || `${login}@github.com`,
    );
    const token = createToken(user.id);

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
}
