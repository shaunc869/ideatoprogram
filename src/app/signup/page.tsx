"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
      window.location.href = "/onboarding";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <p className="text-center text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-indigo-400 hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
