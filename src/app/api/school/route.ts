import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createTeam, getTeamByOwner, joinTeamByCode, setTeamPlanType } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - get teacher's school dashboard
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const team = getTeamByOwner(userId);
  return NextResponse.json({ team });
}

// POST - create school or join school
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { action, schoolName, joinCode, students, planType } = await req.json();

  if (action === "create") {
    const maxSeats = planType === "yearly" ? 99999 : Math.max(5, parseInt(students) || 5);
    const team = createTeam(userId, schoolName || "My School", maxSeats);
    setTeamPlanType(team.id, planType || "monthly", maxSeats);
    return NextResponse.json({ team: getTeamByOwner(userId) });
  }

  if (action === "join") {
    const result = joinTeamByCode(joinCode, userId);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
