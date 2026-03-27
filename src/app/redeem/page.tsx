"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.error) { window.location.href = "/login"; return; }
      setLoggedIn(true);
      setChecking(false);
    });
  }, []);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        const planNames: Record<string, string> = {
          pro_all: "Pro All (all lessons)",
          vibe_pro: "Vibe Pro (unlimited AI)",
          full_access: "Full Access (everything)",
        };
        setSuccess(`Code redeemed! You now have ${planNames[data.plan] || data.plan} access.`);
      } else {
        setError(data.error || "Failed to redeem code");
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
        <div className="text-4xl mb-3">🎁</div>
        <h1 className="text-3xl font-bold mb-3">Redeem a Code</h1>
        <p className="text-gray-400">Got a promo code from a school, event, or referral? Enter it below to unlock access.</p>
      </div>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-green-400 mb-2">Success!</h2>
          <p className="text-gray-300 mb-6">{success}</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition">Go to Dashboard</Link>
        </div>
      ) : (
        <form onSubmit={handleRedeem} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
          <label className="block text-sm font-medium mb-2">Promo Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SCHOOL-FREE-2026"
            className="w-full px-4 py-4 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-indigo-500 focus:outline-none text-center text-xl font-mono tracking-wider mb-4"
            maxLength={30} />
          <button type="submit" disabled={loading || !code.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition disabled:opacity-50">
            {loading ? "Redeeming..." : "Redeem Code"}
          </button>
        </form>
      )}
    </div>
  );
}
