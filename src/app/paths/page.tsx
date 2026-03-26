"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SPECIALIZATION_PATHS, ADVANCED_PYTHON, ADVANCED_JS } from "@/lib/paths";

interface Progress { completedLessons: string[]; }

export default function PathsPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.error) setLoggedIn(true); }).catch(() => {});
    fetch("/api/progress").then((r) => r.json()).then((d) => { if (d.progress) setProgress(d.progress); }).catch(() => {});
  }, []);

  const pythonDone = progress?.completedLessons.filter((id) => id.startsWith("python-")).length ?? 0;
  const jsDone = progress?.completedLessons.filter((id) => id.startsWith("js-")).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Specialization Paths</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Finished your 100 lessons? Choose a specialization, master it, earn a certificate, and build a capstone project.
        </p>
      </div>

      {/* Progress check */}
      {loggedIn && (pythonDone < 100 && jsDone < 100) && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-8 text-center">
          <p className="text-yellow-400 font-medium">Complete 100 pro lessons to unlock specialization paths</p>
          <p className="text-sm text-gray-400 mt-1">Python: {pythonDone}/100 &bull; JavaScript: {jsDone}/100</p>
          <Link href="/lessons" className="inline-block mt-3 text-sm text-indigo-400 hover:underline">Continue lessons &rarr;</Link>
        </div>
      )}

      {/* Path Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SPECIALIZATION_PATHS.map((path) => {
          const isUnlocked = path.language === "python" ? pythonDone >= 100 : jsDone >= 100;
          return (
            <Link key={path.id} href={isUnlocked || !loggedIn ? `/paths/${path.id}` : "#"}
              className={`bg-[#1e293b] border rounded-2xl p-6 transition group ${
                isUnlocked ? "border-[#334155] hover:border-indigo-500" : "border-[#334155]/50 opacity-60"
              }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{path.icon}</div>
                {isUnlocked ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">UNLOCKED</span>
                ) : (
                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">LOCKED</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition">{path.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{path.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{path.lessons.length} lessons</span>
                <span>&bull;</span>
                <span>1 capstone project</span>
                <span>&bull;</span>
                <span>{path.language === "python" ? "🐍 Python" : "⚡ JavaScript"}</span>
              </div>
              <div className="mt-3 text-xs text-indigo-400 font-medium">
                Certificate: {path.certificateName}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Advanced Lessons */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Advanced High-Skill Lessons</h2>
        <p className="text-gray-400 text-center mb-8">For experienced developers ready to level up. Staff/Principal engineer level content.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🐍 Advanced Python <span className="text-sm font-normal text-gray-400">({ADVANCED_PYTHON.length} lessons)</span></h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {ADVANCED_PYTHON.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-[#334155]/30">
                  <span className="text-yellow-400 font-bold w-6">{i + 1}</span>
                  <span className="text-gray-300">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-b from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">⚡ Advanced JavaScript <span className="text-sm font-normal text-gray-400">({ADVANCED_JS.length} lessons)</span></h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {ADVANCED_JS.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-[#334155]/30">
                  <span className="text-blue-400 font-bold w-6">{i + 1}</span>
                  <span className="text-gray-300">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="text-center bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-2">Total Learning Content</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div><div className="text-3xl font-extrabold text-indigo-400">220</div><div className="text-sm text-gray-400">Core Lessons</div></div>
          <div><div className="text-3xl font-extrabold text-pink-400">50</div><div className="text-sm text-gray-400">Path Lessons</div></div>
          <div><div className="text-3xl font-extrabold text-yellow-400">40</div><div className="text-sm text-gray-400">Advanced Lessons</div></div>
          <div><div className="text-3xl font-extrabold text-green-400">310</div><div className="text-sm text-gray-400">Total</div></div>
        </div>
      </div>
    </div>
  );
}
