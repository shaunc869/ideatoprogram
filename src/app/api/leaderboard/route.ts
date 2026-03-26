import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const leaderboard = getLeaderboard(20);
  return NextResponse.json({ leaderboard });
}
