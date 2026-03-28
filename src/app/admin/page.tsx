"use client";
import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  proUsers: number;
  vibeUsers: number;
  lessonsCompleted: number;
  totalXP: number;
  activeToday: number;
  revenueCents: number;
  topLessons: { lessonId: string; title: string; completions: number }[];
}

interface PromoCode {
  code: string;
  planType: string;
  maxUses: number;
  uses: number;
  note: string;
  active: boolean;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState({ code: "", planType: "full_access", maxUses: 0, note: "" });
  const [grantEmail, setGrantEmail] = useState("");
  const [message, setMessage] = useState("");

  const [denied, setDenied] = useState(false);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true }));
      if (meRes.error) { window.location.href = "/login"; return; }

      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.status === 403) { setDenied(true); setLoading(false); return; }
      const statsData = await statsRes.json().catch(() => null);
      if (statsData?.stats) setStats(statsData.stats);

      const codesRes = await fetch("/api/promo").then((r) => r.json()).catch(() => ({ codes: [] }));
      if (codesRes.codes) setCodes(codesRes.codes);
      setLoading(false);
    }
    load();
  }, []);

  async function createCode() {
    if (!newCode.code) return;
    const res = await fetch("/api/promo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCode),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Promo code "${newCode.code.toUpperCase()}" created!`);
      setNewCode({ code: "", planType: "full_access", maxUses: 0, note: "" });
      const codesRes = await fetch("/api/promo").then((r) => r.json());
      if (codesRes.codes) setCodes(codesRes.codes);
    } else {
      setMessage("Failed to create code (might already exist)");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function grantAccess() {
    if (!grantEmail) return;
    const res = await fetch("/api/admin/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: grantEmail }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.success) setGrantEmail("");
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;

  if (denied) return (
    <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
      <div>
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">The admin dashboard is restricted to authorized accounts only.</p>
      </div>
    </div>
  );

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Pro Users", value: stats.proUsers },
    { label: "Vibe Users", value: stats.vibeUsers },
    { label: "Lessons Done", value: stats.lessonsCompleted },
    { label: "Total XP", value: stats.totalXP },
    { label: "Active Today", value: stats.activeToday },
    { label: "Revenue", value: `$${((stats.revenueCents || 0) / 100).toFixed(2)}` },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-indigo-200 mt-1">Manage your platform, create promo codes, and grant access.</p>
        </div>
        <a href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium text-white transition">
          Switch to User Dashboard &rarr;
        </a>
      </div>

      {message && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-6">{message}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Grant Access */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">🎁 Grant Free Access</h2>
          <p className="text-gray-400 text-sm mb-4">Give any user full unlimited access (all lessons + vibe pro + all specializations). Enter their email:</p>
          <div className="flex gap-3">
            <input type="email" value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="teacher@school.edu"
              className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-indigo-500 focus:outline-none" />
            <button onClick={grantAccess} disabled={!grantEmail}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition disabled:opacity-50">Grant</button>
          </div>
        </div>

        {/* Create Promo Code */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">🏷️ Create Promo Code</h2>
          <p className="text-gray-400 text-sm mb-4">Create codes that schools/users can redeem at /redeem for free access.</p>
          <div className="space-y-3">
            <input type="text" value={newCode.code} onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
              placeholder="SCHOOL-FREE-2026" className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-indigo-500 focus:outline-none font-mono" />
            <div className="flex gap-3">
              <select value={newCode.planType} onChange={(e) => setNewCode({ ...newCode, planType: e.target.value })}
                className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:outline-none">
                <option value="full_access">Full Access (everything)</option>
                <option value="pro_all">Pro All (lessons only)</option>
                <option value="vibe_pro">Vibe Pro (AI only)</option>
              </select>
              <input type="number" value={newCode.maxUses || ""} onChange={(e) => setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 0 })}
                placeholder="Max uses (0=unlimited)" className="w-40 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:outline-none" />
            </div>
            <input type="text" value={newCode.note} onChange={(e) => setNewCode({ ...newCode, note: e.target.value })}
              placeholder="Note: e.g. Lincoln High School pilot" className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:outline-none" />
            <button onClick={createCode} disabled={!newCode.code}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition disabled:opacity-50">Create Code</button>
          </div>
        </div>
      </div>

      {/* Active Promo Codes */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <h2 className="text-lg font-bold">Active Promo Codes</h2>
          <span className="text-sm text-gray-400">{codes.length} codes</span>
        </div>
        {codes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No promo codes yet. Create one above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-[#334155]">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Uses</th>
                <th className="px-6 py-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.code} className="border-b border-[#334155]/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-400">{c.code}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      c.planType === "full_access" ? "bg-green-500/20 text-green-400" :
                      c.planType === "pro_all" ? "bg-indigo-500/20 text-indigo-400" :
                      "bg-pink-500/20 text-pink-400"
                    }`}>{c.planType}</span>
                  </td>
                  <td className="px-6 py-3">{c.uses}{c.maxUses > 0 ? `/${c.maxUses}` : " (unlimited)"}</td>
                  <td className="px-6 py-3 text-gray-400">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Top Lessons */}
      {stats?.topLessons && stats.topLessons.length > 0 && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#334155]">
            <h2 className="text-lg font-bold">Top Completed Lessons</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-[#334155]">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Lesson</th>
                <th className="px-6 py-3 text-right">Completions</th>
              </tr>
            </thead>
            <tbody>
              {stats.topLessons.slice(0, 10).map((lesson, i) => (
                <tr key={lesson.lessonId} className="border-b border-[#334155]/50">
                  <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3">{lesson.lessonId}</td>
                  <td className="px-6 py-3 text-right text-indigo-400">{lesson.completions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
