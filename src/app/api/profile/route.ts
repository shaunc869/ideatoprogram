import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateUserProfile, getUserById } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { name } = await req.json();
  await updateUserProfile(userId, name);
  const user = await getUserById(userId);
  return NextResponse.json({ user });
}
