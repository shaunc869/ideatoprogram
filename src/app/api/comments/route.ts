import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getComments, addComment, deleteComment } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  const comments = getComments(lessonId);
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { lessonId, text } = await req.json();

  if (!lessonId || !text) {
    return NextResponse.json({ error: "lessonId and text are required" }, { status: 400 });
  }

  if (text.length < 1 || text.length > 500) {
    return NextResponse.json(
      { error: "Comment must be between 1 and 500 characters" },
      { status: 400 },
    );
  }

  const comment = addComment(userId, lessonId, text);
  return NextResponse.json({ comment });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const commentId = req.nextUrl.searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json({ error: "commentId is required" }, { status: 400 });
  }

  const success = deleteComment(parseInt(commentId), userId);

  if (!success) {
    return NextResponse.json({ error: "Comment not found or not authorized" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
