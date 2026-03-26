import { NextResponse } from "next/server";
import { getGuidedProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ projects: getGuidedProjects() });
}
