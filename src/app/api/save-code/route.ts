import { NextRequest, NextResponse } from "next/server";
import { verifyToken, saveCode, getSavedCode } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { lessonId, code } = await req.json();
  await saveCode(userId, lessonId, code);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const code = await getSavedCode(userId, lessonId!);
  return NextResponse.json({ code });
}
