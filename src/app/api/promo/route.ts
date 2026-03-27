import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, redeemPromoCode, createPromoCode, getPromoCodes } from "@/lib/db";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = ["jeffersonsclark@gmail.com"];

function isAdmin(userId: string): boolean {
  const user = getUserById(userId);
  return !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());
}

// Redeem a promo code (any logged-in user)
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  const result = redeemPromoCode(userId, code);
  return NextResponse.json(result);
}

// Admin: list all promo codes
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  if (!isAdmin(userId)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  return NextResponse.json({ codes: getPromoCodes() });
}

// Admin: create promo code
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  if (!isAdmin(userId)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { code, planType, maxUses, note } = await req.json();
  if (!code || !planType) return NextResponse.json({ error: "Code and planType required" }, { status: 400 });

  const success = createPromoCode(code, planType, maxUses || 0, note || "");
  return NextResponse.json({ success });
}
