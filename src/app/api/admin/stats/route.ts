import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getAdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  // Basic admin check - for now just verify the user exists
  // TODO: Add proper admin check (e.g., check if email ends with @admin.com or user is first created)
  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const stats = getAdminStats();
  return NextResponse.json({ stats });
}
