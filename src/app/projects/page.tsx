"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project { id: string; lessonGroup: string; title: string; description: string; requirements: string; starterCode: string; language: string; afterLesson: number; }
interface Progress { completedLessons: string[]; }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/guided-projects").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()).catch(() => ({})),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
    ]).then(([projData, progData, userData]) => {
      if (projData.projects) setProjects(projData.projects);
      if (progData.progress) setProgress(progData.progress);
      if (!userData.error) setLoggedIn(true);
    });
  }, []);

  function isUnlocked(project: Project): boolean {
    if (!progress) return false;
    const prefix = project.lessonGroup === "javascript" ? "js-" : "python-";
    return progress.completedLessons.filter((id) => id.startsWith(prefix)).length >= project.afterLesson;
  }

  const pyProjects = projects.filter((p) => p.lessonGroup === "python");
  const jsProjects = projects.filter((p) => p.lessonGroup === "javascript");

  function renderTrack(title: string, icon: string, color: string, trackProjects: Project[]) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>{icon}</span> {title}
          <span className="text-sm font-normal text-gray-400">({trackProjects.length} projects)</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {trackProjects.map((p) => {
            const unlocked = isUnlocked(p);
            return (
              <div key={p.id} className={`bg-[#1e293b] border rounded-2xl p-5 transition ${unlocked ? `border-[#334155] hover:border-${color}-500/50` : "border-[#334155]/50 opacity-50"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400`}>
                    After Lesson {p.afterLesson}
                  </span>
                  {unlocked ? (
                    <span className="text-xs text-green-400">✓ Unlocked</span>
                  ) : (
                    <span className="text-xs text-gray-500">🔒 Locked</span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{p.description}</p>
                <div className="text-xs text-gray-500 mb-4">
                  <strong>Requirements:</strong>
                  <ul className="mt-1 space-y-0.5">
                    {p.requirements.split("\\n").map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                {unlocked && loggedIn && (
                  <Link href="/vibe" className={`inline-block px-4 py-2 bg-${color}-600 hover:bg-${color}-500 rounded-lg text-sm font-medium transition`}>
                    Build in Vibe Studio →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Guided Projects</h1>
        <p className="text-gray-400 text-lg">Every 10 lessons, put your skills to the test with a real project.</p>
      </div>
      {renderTrack("Python Projects", "🐍", "yellow", pyProjects)}
      {renderTrack("JavaScript Projects", "⚡", "blue", jsProjects)}
    </div>
  );
}
