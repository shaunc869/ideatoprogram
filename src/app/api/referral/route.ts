import { NextRequest, NextResponse } from "next/server";
import { verifyToken, applyReferral, getUserById, getReferralCount } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { referralCode } = await req.json();
  const success = applyReferral(referralCode, userId);
  return NextResponse.json({ success, user: getUserById(userId) });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ referralCode: user.referralCode, referralCount: getReferralCount(userId) });
}
