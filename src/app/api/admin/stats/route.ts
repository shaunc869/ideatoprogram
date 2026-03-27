import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, getAdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = ["jeffersonsclark@gmail.com"];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = getUserById(userId);
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Not authorized. Admin access only." }, { status: 403 });
  }

  const stats = getAdminStats();
  return NextResponse.json({ stats });
}
