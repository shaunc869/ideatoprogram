import { NextRequest, NextResponse } from "next/server";
import { verifyToken, setUserPath, getUserById } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { path } = await req.json();
  if (!path || !["python", "javascript", "both"].includes(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  setUserPath(userId, path);
  const user = getUserById(userId);
  return NextResponse.json({ user });
}
