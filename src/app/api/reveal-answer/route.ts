import { NextRequest, NextResponse } from "next/server";
import { verifyToken, revealAnswer } from "@/lib/db";
import { getChallengeForLesson } from "@/lib/challenges";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const challenge = getChallengeForLesson(lessonId);
  if (!challenge) return NextResponse.json({ error: "No challenge for this lesson" }, { status: 404 });

  const progress = revealAnswer(userId, lessonId);
  if (!progress) {
    return NextResponse.json({ error: "Not enough XP (need 5 XP)" }, { status: 400 });
  }

  return NextResponse.json({ progress, solution: challenge.solution });
}
