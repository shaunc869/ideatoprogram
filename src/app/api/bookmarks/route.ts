import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserBookmarks, toggleBookmark } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const bookmarks = await getUserBookmarks(userId);
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { lessonId } = await req.json();
  const bookmarked = await toggleBookmark(userId, lessonId);
  const bookmarks = await getUserBookmarks(userId);
  return NextResponse.json({ bookmarked, bookmarks });
}
