import { NextRequest, NextResponse } from "next/server";
import { createUser, createToken } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const user = createUser(name, email, password);
  if (!user) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
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
