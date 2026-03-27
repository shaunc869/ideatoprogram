"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

interface Progress {
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      let userData = await fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true }));

      // If first attempt fails, wait and retry once (cookie may still be setting)
      if (userData.error) {
        await new Promise((r) => setTimeout(r, 500));
        userData = await fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true }));
      }

      if (userData.error) {
        window.location.href = "/login";
        return;
      }

      setUser(userData.user);
      const progressData = await fetch("/api/progress").then((r) => r.json()).catch(() => ({ progress: null }));
      if (progressData.progress) setProgress(progressData.progress);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }
  if (!user) return null;

  const freeCompleted = progress?.completedLessons.filter((id) => id.startsWith("free-")).length ?? 0;
  const pythonCompleted = progress?.completedLessons.filter((id) => id.startsWith("python-")).length ?? 0;
  const jsCompleted = progress?.completedLessons.filter((id) => id.startsWith("js-")).length ?? 0;
  const totalCompleted = progress?.completedLessons.length ?? 0;
  const totalXp = progress?.xp ?? 0;
  const redoCount = progress?.revealedAnswers.length ?? 0;

  // Level calculation: every 100 XP = 1 level
  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;

  // Find next lesson to do
  function getNextLesson(prefix: string, max: number): string | null {
    for (let i = 1; i <= max; i++) {
      const id = `${prefix}${i}`;
      if (!progress?.completedLessons.includes(id)) return id;
    }
    return null;
  }

  const nextFree = getNextLesson("free-", 10);
  const nextPython = getNextLesson("python-", 100);
  const nextJs = getNextLesson("js-", 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-400">
          {user.isPro ? (
            <span className="inline-flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">PRO</span>
              You have access to all 760+ lessons
            </span>
          ) : (
            <span>You have access to 10 free lessons. <Link href="/upgrade" className="text-indigo-400 hover:underline">Upgrade to Pro</Link> for all 760+.</span>
          )}
        </p>
      </div>

      {/* XP & Level Card */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Your Level</div>
            <div className="text-4xl font-bold flex items-center gap-2">
              <span className="text-yellow-400">&#9733;</span> Level {level}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Total XP</div>
            <div className="text-3xl font-bold text-yellow-400">{totalXp}</div>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">Level {level}</span>
          <span className="text-gray-400">{xpInLevel}/100 XP to Level {level + 1}</span>
        </div>
        <div className="h-3 bg-[#0f172a] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${xpInLevel}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <div className="text-xs text-gray-400">Lessons Done</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{totalXp}</div>
            <div className="text-xs text-gray-400">XP Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{redoCount}</div>
            <div className="text-xs text-gray-400">Need Redo</div>
          </div>
        </div>
      </div>

      {/* Track Progress Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h3 className="font-bold text-lg mb-1">Free Lessons</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-bold text-green-400">{freeCompleted}/10</p>
          </div>
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(freeCompleted / 10) * 100}%` }} />
          </div>
          {nextFree ? (
            <Link href={`/lessons/${nextFree}`} className="text-sm text-indigo-400 hover:underline">Continue &rarr;</Link>
          ) : (
            <span className="text-sm text-green-400">&#10003; All complete!</span>
          )}
        </div>

        <div className={`bg-[#1e293b] border rounded-xl p-6 ${user.isPro ? "border-[#334155]" : "border-[#334155] opacity-60"}`}>
          <h3 className="font-bold text-lg mb-1">Python {!user.isPro && <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full ml-1">PRO</span>}</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-bold text-yellow-400">{pythonCompleted}/100</p>
          </div>
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pythonCompleted}%` }} />
          </div>
          {user.isPro && nextPython ? (
            <Link href={`/lessons/${nextPython}`} className="text-sm text-indigo-400 hover:underline">Continue &rarr;</Link>
          ) : user.isPro ? (
            <span className="text-sm text-green-400">&#10003; All complete!</span>
          ) : (
            <Link href="/upgrade" className="text-sm text-indigo-400 hover:underline">Unlock &rarr;</Link>
          )}
        </div>

        <div className={`bg-[#1e293b] border rounded-xl p-6 ${user.isPro ? "border-[#334155]" : "border-[#334155] opacity-60"}`}>
          <h3 className="font-bold text-lg mb-1">JavaScript {!user.isPro && <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full ml-1">PRO</span>}</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-bold text-blue-400">{jsCompleted}/100</p>
          </div>
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${jsCompleted}%` }} />
          </div>
          {user.isPro && nextJs ? (
            <Link href={`/lessons/${nextJs}`} className="text-sm text-indigo-400 hover:underline">Continue &rarr;</Link>
          ) : user.isPro ? (
            <span className="text-sm text-green-400">&#10003; All complete!</span>
          ) : (
            <Link href="/upgrade" className="text-sm text-indigo-400 hover:underline">Unlock &rarr;</Link>
          )}
        </div>
      </div>

      {/* Quick Start / Continue */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Continue Learning</h2>
        <div className="space-y-3">
          {nextFree && (
            <Link href={`/lessons/${nextFree}`} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg hover:bg-[#0f172a]/80 transition">
              <div className="flex items-center gap-3">
                <span className="text-green-400">&#128218;</span>
                <span>Free: Lesson {nextFree.split("-")[1]}</span>
              </div>
              <span className="text-indigo-400">&rarr;</span>
            </Link>
          )}
          {user.isPro && nextPython && (
            <Link href={`/lessons/${nextPython}`} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg hover:bg-[#0f172a]/80 transition">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">&#128013;</span>
                <span>Python: Lesson {nextPython.split("-")[1]}</span>
              </div>
              <span className="text-indigo-400">&rarr;</span>
            </Link>
          )}
          {user.isPro && nextJs && (
            <Link href={`/lessons/${nextJs}`} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg hover:bg-[#0f172a]/80 transition">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">&#9889;</span>
                <span>JavaScript: Lesson {nextJs.split("-")[1]}</span>
              </div>
              <span className="text-indigo-400">&rarr;</span>
            </Link>
          )}
          {redoCount > 0 && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-400">
              &#9888; You have {redoCount} lesson{redoCount > 1 ? "s" : ""} that need to be redone (answer was revealed)
            </div>
          )}
        </div>
      </div>

      {!user.isPro && (
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Unlock All 760+ Lessons</h3>
          <p className="text-gray-300 mb-4">Get lifetime access to 100 Python + 100 JavaScript pro lessons for just $10</p>
          <Link href="/upgrade" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">
            Upgrade to Pro - $10
          </Link>
        </div>
      )}
    </div>
  );
}
