import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, grantFullAccessByEmail } from "@/lib/db";

const ADMIN_EMAILS = ["jeffersonsclark@gmail.com"];

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = getUserById(userId);
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Not authorized. Admin access only." }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const success = grantFullAccessByEmail(email);
  if (!success) return NextResponse.json({ error: "User not found with that email" }, { status: 404 });

  return NextResponse.json({ success: true, message: `Full access granted to ${email}` });
}
