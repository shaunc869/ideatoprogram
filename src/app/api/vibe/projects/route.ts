import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserVibeProjects, createVibeProject } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const projects = getUserVibeProjects(userId);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { title, language } = await req.json();
  const project = createVibeProject(userId, title, language);
  return NextResponse.json({ project });
}
