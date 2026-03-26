import { NextRequest, NextResponse } from "next/server";
import { verifyToken, shareProject, getSharedProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { projectId } = await req.json();

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  try {
    const shareId = shareProject(projectId, userId);
    return NextResponse.json({ shareId, url: `/shared/${shareId}` });
  } catch (error) {
    if (error instanceof Error && error.message === "Project not found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const shareId = req.nextUrl.searchParams.get("shareId");

  if (!shareId) {
    return NextResponse.json({ error: "shareId is required" }, { status: 400 });
  }

  const project = getSharedProject(shareId);

  if (!project) {
    return NextResponse.json({ error: "Shared project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
