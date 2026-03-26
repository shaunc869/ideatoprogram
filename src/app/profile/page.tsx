"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  createdAt: string;
}

interface Progress {
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [nameStatus, setNameStatus] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()).catch(() => ({ progress: null })),
      fetch("/api/streak").then((r) => r.json()).catch(() => ({ streak: null })),
      fetch("/api/achievements").then((r) => r.json()).catch(() => ({ achievements: [], allBadges: [] })),
    ]).then(([userData, progressData, streakData, achievementsData]) => {
      if (userData.error) {
        router.push("/login");
      } else {
        setUser(userData.user);
        setDisplayName(userData.user.name || "");
        if (progressData.progress) setProgress(progressData.progress);
        if (streakData.streak) setStreak(streakData.streak);
        if (achievementsData.achievements) setEarnedBadges(achievementsData.achievements.map((a: Badge) => a.id));
        if (achievementsData.allBadges) setAllBadges(achievementsData.allBadges);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }
  if (!user) return null;

  const totalXp = progress?.xp ?? 0;
  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;
  const totalCompleted = progress?.completedLessons.length ?? 0;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  async function handleNameChange(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setNameSaving(true);
    setNameStatus("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNameStatus("Display name updated!");
        setUser((prev) => prev ? { ...prev, name: displayName.trim() } : prev);
      } else {
        setNameStatus(data.error || "Failed to update name.");
      }
    } catch {
      setNameStatus("Network error. Please try again.");
    }
    setNameSaving(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  async function handleThemeToggle() {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch {
      // silently fail
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            className="px-4 py-2 rounded-lg border border-[#334155] bg-[#1e293b] hover:border-indigo-500 transition text-sm"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition text-sm"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Joined</p>
            <p className="text-lg font-medium">{joinDate}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">{totalXp}</p>
          <p className="text-sm text-gray-400">Total XP</p>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">Lv {level}</p>
          <p className="text-sm text-gray-400">{xpInLevel}/100 XP</p>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{streak?.currentStreak ?? 0}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{streak?.longestStreak ?? 0}</p>
          <p className="text-sm text-gray-400">Best Streak</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Level {level} Progress</span>
          <span className="text-gray-400">{xpInLevel} / 100 XP</span>
        </div>
        <div className="w-full bg-[#0f172a] rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{totalCompleted} lessons completed</p>
      </div>

      {/* Badges */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        {allBadges.length === 0 ? (
          <p className="text-gray-400 text-sm">No badges available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-lg p-4 text-center transition ${
                    earned
                      ? "bg-indigo-600/10 border border-indigo-500/30"
                      : "bg-[#0f172a] border border-[#334155] opacity-40 grayscale"
                  }`}
                  title={badge.description}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className={`text-sm font-medium ${earned ? "text-white" : "text-gray-500"}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Change Display Name */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Change Display Name</h2>
        <form onSubmit={handleNameChange} className="flex gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="displayName" className="block text-sm text-gray-400 mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-[#334155] focus:border-indigo-500 focus:outline-none transition text-white"
              placeholder="Enter your display name"
            />
          </div>
          <button
            type="submit"
            disabled={nameSaving}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium disabled:opacity-50"
          >
            {nameSaving ? "Saving..." : "Save"}
          </button>
        </form>
        {nameStatus && (
          <p className={`text-sm mt-2 ${nameStatus.includes("updated") ? "text-green-400" : "text-red-400"}`}>
            {nameStatus}
          </p>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Old Password</label>
            <input
              type="password"
              disabled
              className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-gray-500 cursor-not-allowed"
              placeholder="********"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              disabled
              className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-gray-500 cursor-not-allowed"
              placeholder="********"
            />
          </div>
          <p className="text-sm text-yellow-400/80 bg-yellow-400/10 border border-yellow-500/20 rounded-lg px-4 py-2">
            Password change coming soon
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Dashboard
        </Link>
        <Link
          href="/leaderboard"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Leaderboard
        </Link>
        <Link
          href="/certificate"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Certificates
        </Link>
      </div>
    </div>
  );
}
