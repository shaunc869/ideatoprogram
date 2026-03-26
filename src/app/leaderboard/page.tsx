"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  lessonsCompleted: number;
}

interface User {
  id: string;
  name: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/leaderboard").then((r) => r.json()).catch(() => ({ leaderboard: [] })),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
    ]).then(([leaderboardData, userData]) => {
      if (leaderboardData.leaderboard) setEntries(leaderboardData.leaderboard);
      if (!userData.error && userData.user) setCurrentUser(userData.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }

  function getMedalColor(position: number): string {
    if (position === 1) return "text-yellow-400";
    if (position === 2) return "text-gray-300";
    if (position === 3) return "text-amber-600";
    return "text-gray-500";
  }

  function getMedalIcon(position: number): string {
    if (position === 1) return "\uD83E\uDD47";
    if (position === 2) return "\uD83E\uDD48";
    if (position === 3) return "\uD83E\uDD49";
    return "";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Dashboard
        </Link>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 w-16">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">XP</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Lessons</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No learners on the leaderboard yet. Be the first!
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => {
                const position = index + 1;
                const isCurrentUser = currentUser?.id === entry.id;
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-[#334155] last:border-b-0 transition ${
                      isCurrentUser
                        ? "bg-indigo-600/10 border-l-2 border-l-indigo-500"
                        : "hover:bg-[#263248]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {position <= 3 ? (
                          <span className="text-xl">{getMedalIcon(position)}</span>
                        ) : (
                          <span className={`font-semibold ${getMedalColor(position)}`}>{position}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${isCurrentUser ? "text-indigo-400" : "text-white"}`}>
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-indigo-400">{entry.xp.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm ml-1">XP</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-300">{entry.lessonsCompleted}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {currentUser && !entries.some((e) => e.id === currentUser.id) && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Complete some lessons to appear on the leaderboard!
        </p>
      )}

      <div className="flex gap-4 mt-8">
        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Profile
        </Link>
        <Link
          href="/lessons"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-sm font-medium"
        >
          Start Learning
        </Link>
      </div>
    </div>
  );
}
