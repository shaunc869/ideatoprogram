"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function JoinSchoolPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((data) => {
      if (data.error) { window.location.href = "/login"; return; }
      setLoggedIn(true);
      setChecking(false);
    });
  }, []);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", joinCode: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`You've joined ${data.teamName}! You now have Pro access to all 760+ lessons.`);
      } else {
        setError(data.error || "Failed to join school");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  if (!loggedIn) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#127891;</div>
        <h1 className="text-3xl font-bold mb-3">Join Your School</h1>
        <p className="text-gray-400">Enter the code your teacher gave you to get Pro access to all lessons.</p>
      </div>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">&#127881;</div>
          <h2 className="text-xl font-bold text-green-400 mb-2">You&apos;re In!</h2>
          <p className="text-gray-300 mb-6">{success}</p>
          <Link href="/lessons" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition">Start Learning</Link>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
          <label className="block text-sm font-medium mb-2">School Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SCHOOL-A7B3C2"
            className="w-full px-4 py-4 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-emerald-500 focus:outline-none text-center text-2xl font-mono tracking-widest mb-4"
            maxLength={15} />
          <button type="submit" disabled={loading || !code.trim()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition disabled:opacity-50">
            {loading ? "Joining..." : "Join School"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have a code? Ask your teacher for the school join code.
          </p>
        </form>
      )}
    </div>
  );
}
