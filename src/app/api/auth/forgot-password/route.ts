import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const token = createPasswordResetToken(email);

  const resendApiKey = process.env.RESEND_API_KEY;

  if (token && resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);

      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;

      await resend.emails.send({
        from: "IdeaToProgram <noreply@codelearner.dev>",
        to: email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link will expire in 1 hour.</p>`,
      });
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  }

  // In development (no Resend key), return the token for testing
  if (!resendApiKey && token) {
    return NextResponse.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
      token, // only included in dev when no RESEND_API_KEY
    });
  }

  // Always return the same message to avoid leaking whether email exists
  return NextResponse.json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
  });
}
