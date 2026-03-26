"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPathById } from "@/lib/paths";
import type { SpecializationPath } from "@/lib/paths";

export default function PathDetailPage() {
  const params = useParams();
  const [path, setPath] = useState<SpecializationPath | null>(null);
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    const found = getPathById(params.id as string);
    if (found) setPath(found);
    fetch("/api/progress").then((r) => r.json()).then((d) => {
      if (d.progress) setProgress(d.progress.completedLessons);
    }).catch(() => {});
  }, [params.id]);

  if (!path) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;

  const completedCount = path.lessons.filter((l) => progress.includes(l.id)).length;
  const allDone = completedCount === path.lessons.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/paths" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">&larr; All Paths</Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{path.icon}</div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{path.name}</h1>
            <p className="text-gray-400 text-lg">{path.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{path.lessons.length} lessons</span>
          <span>&bull;</span>
          <span>1 capstone project</span>
          <span>&bull;</span>
          <span>{path.language === "python" ? "🐍 Python" : "⚡ JavaScript"}</span>
          <span>&bull;</span>
          <span className="text-indigo-400">{path.certificateName}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">{completedCount}/{path.lessons.length} lessons completed</span>
          <span className="text-gray-400">{Math.round((completedCount / path.lessons.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / path.lessons.length) * 100}%` }} />
        </div>
      </div>

      {/* Lessons */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Lessons</h2>
        <div className="space-y-2">
          {path.lessons.map((lesson) => {
            const done = progress.includes(lesson.id);
            return (
              <div key={lesson.id} className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                done ? "bg-green-500/5 border-green-500/20" : "bg-[#1e293b] border-[#334155]"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  done ? "bg-green-600" : "bg-indigo-600"
                }`}>
                  {done ? "✓" : lesson.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-gray-400">{lesson.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capstone Project */}
      <div className="mb-12 bg-gradient-to-b from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🏗️</div>
          <div>
            <h2 className="text-2xl font-bold">Capstone: {path.capstoneTitle}</h2>
            <p className="text-gray-400">{path.capstoneDescription}</p>
          </div>
        </div>
        <h3 className="font-bold text-sm text-gray-300 mb-3">Requirements:</h3>
        <ul className="space-y-2 mb-6">
          {path.capstoneRequirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-indigo-400 mt-0.5">□</span> {req}
            </li>
          ))}
        </ul>
        {allDone ? (
          <Link href="/vibe" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition">
            Build in Vibe Studio &rarr;
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Complete all {path.lessons.length} lessons to unlock the capstone project.</p>
        )}
      </div>

      {/* Certificate */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">{allDone ? "🎓" : "🔒"}</div>
        <h2 className="text-xl font-bold mb-2">{path.certificateName}</h2>
        <p className="text-gray-400 text-sm mb-4">
          {allDone
            ? "Congratulations! You've earned this certificate."
            : `Complete all lessons and the capstone to earn your ${path.certificateName} certificate.`
          }
        </p>
        {allDone && (
          <Link href="/certificate" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold transition hover:from-indigo-500 hover:to-purple-500">
            View Certificate
          </Link>
        )}
      </div>
    </div>
  );
}
