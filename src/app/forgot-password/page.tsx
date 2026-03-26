"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [devToken, setDevToken] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSent(true);

      // Dev mode: show token if returned
      if (data.token) {
        setDevToken(data.token);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400 text-sm mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {sent ? (
            <div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 text-sm">
                  Check your email for a reset link.
                </p>
              </div>

              {devToken && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 text-xs mb-2 font-medium">Dev Mode Token:</p>
                  <p className="text-yellow-300 text-xs font-mono break-all mb-2">{devToken}</p>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="text-indigo-400 hover:text-indigo-300 text-xs underline"
                  >
                    Reset password with this token
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 text-sm underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 mb-4"
                placeholder="you@example.com"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors mb-4"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 text-sm underline"
              >
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
