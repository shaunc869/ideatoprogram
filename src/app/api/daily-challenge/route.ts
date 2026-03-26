import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTodayChallenge, submitDailyChallenge } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ challenge: getTodayChallenge() });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { code, passed } = await req.json();
  submitDailyChallenge(userId, code, passed);
  return NextResponse.json({ success: true });
}
