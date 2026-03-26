import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserAchievements, ALL_BADGES } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const achievements = await getUserAchievements(userId);
  return NextResponse.json({ achievements, allBadges: ALL_BADGES });
}
