"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }

        const statsRes = await fetch("/api/admin/stats");
        if (!statsRes.ok) {
          router.push("/login");
          return;
        }
        const data = await statsRes.json();
        setStats(data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString() },
    { label: "Pro Users", value: stats.proUsers.toLocaleString() },
    { label: "Vibe Users", value: stats.vibeUsers.toLocaleString() },
    { label: "Lessons Completed", value: stats.lessonsCompleted.toLocaleString() },
    { label: "Total XP", value: stats.totalXP.toLocaleString() },
    { label: "Active Today", value: stats.activeToday.toLocaleString() },
    { label: "Revenue", value: `$${(stats.revenueCents / 100).toFixed(2)}` },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-indigo-200 mt-1 text-sm">Platform overview and statistics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-[#1e293b] border border-[#334155] rounded-lg p-4"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Top Lessons Table */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#334155]">
            <h2 className="text-lg font-semibold text-white">Top 10 Most Completed Lessons</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#334155]">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Lesson</th>
                <th className="px-6 py-3 text-right">Completions</th>
              </tr>
            </thead>
            <tbody>
              {stats.topLessons.slice(0, 10).map((lesson, i) => (
                <tr
                  key={lesson.lessonId}
                  className="border-b border-[#334155]/50 last:border-0 hover:bg-[#334155]/20"
                >
                  <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3 text-sm text-white">{lesson.title}</td>
                  <td className="px-6 py-3 text-sm text-right text-indigo-400">
                    {lesson.completions.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
