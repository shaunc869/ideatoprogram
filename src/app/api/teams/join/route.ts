import { NextRequest, NextResponse } from "next/server";
import { verifyToken, addTeamMember } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { teamId } = await req.json();
  const success = addTeamMember(teamId, userId);
  return NextResponse.json({ success });
}
