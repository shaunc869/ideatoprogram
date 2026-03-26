import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    await resetPassword(email, newPassword);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reset password";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
