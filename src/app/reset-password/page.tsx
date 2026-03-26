"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-with-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid or expired token");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 text-center">
        <p className="text-red-400 mb-4">No reset token provided.</p>
        <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
          <p className="text-green-400 text-sm">Your password has been reset successfully.</p>
        </div>
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
      <p className="text-gray-400 text-sm mb-6">Enter your new password below.</p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 mb-4"
          placeholder="At least 6 characters"
        />

        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 mb-4"
          placeholder="Repeat your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors mb-4"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
          Back to Login
        </Link>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 text-center text-gray-400">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
