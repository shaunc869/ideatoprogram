import { NextRequest, NextResponse } from "next/server";
import { verifyToken, canPickFreeSpec, addFreeSpecPick } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json(canPickFreeSpec(userId));
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { specId } = await req.json();
  if (!specId) return NextResponse.json({ error: "specId required" }, { status: 400 });

  const status = canPickFreeSpec(userId);
  if (!status.eligible) return NextResponse.json({ error: "Complete 100 lessons or get Pro to unlock free picks" }, { status: 403 });
  if (status.picksRemaining <= 0) return NextResponse.json({ error: "You've already used both free picks" }, { status: 400 });

  const success = addFreeSpecPick(userId, specId);
  if (!success) return NextResponse.json({ error: "Already picked or limit reached" }, { status: 400 });

  return NextResponse.json({ success: true, ...canPickFreeSpec(userId) });
}
