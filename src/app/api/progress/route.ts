import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getProgress, completeLesson, getXpReward } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json({ progress: getProgress(userId) });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { lessonId, lessonOrder } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const xpReward = getXpReward(lessonOrder || 1);
  const progress = completeLesson(userId, lessonId, xpReward);
  return NextResponse.json({ progress, xpEarned: xpReward });
}
