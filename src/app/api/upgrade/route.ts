import { NextRequest, NextResponse } from "next/server";
import { verifyToken, subscribe, getUserById } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { plan = "pro_all", billing = "monthly", cardNumber } = await req.json();

  if (!cardNumber || cardNumber.length < 13) {
    return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
  }

  subscribe(userId, plan, billing);
  return NextResponse.json({ success: true, user: getUserById(userId) });
}
