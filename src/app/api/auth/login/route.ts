import { NextRequest, NextResponse } from "next/server";
import { loginUser, createToken, grantFullAccess } from "@/lib/db";

const ADMIN_EMAILS = ["jeffersonsclark@gmail.com"];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = loginUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Auto-grant admin full access
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    grantFullAccess(user.id);
    user.isPro = true;
    user.isVibeUnlimited = true;
  }

  const token = createToken(user.id);
  const response = NextResponse.json({ user, token });
  response.cookies.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
