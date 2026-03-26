import { NextRequest, NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 },
    );
  }

  const success = resetPasswordWithToken(token, newPassword);

  if (!success) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, message: "Password has been reset successfully." });
}
