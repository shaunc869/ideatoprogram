import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateUserTheme } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { theme } = await req.json();
  await updateUserTheme(userId, theme);
  return NextResponse.json({ success: true });
}
