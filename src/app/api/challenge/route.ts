import { NextRequest, NextResponse } from "next/server";
import { getChallengeForLesson } from "@/lib/challenges";

export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const challenge = getChallengeForLesson(lessonId);
  if (!challenge) return NextResponse.json({ error: "No challenge found" }, { status: 404 });

  // Don't send solution to client
  const { id, lessonId: lid, prompt, starterCode, expectedOutput, hint, language } = challenge;
  return NextResponse.json({ challenge: { id, lessonId: lid, prompt, starterCode, expectedOutput, hint, language } });
}
