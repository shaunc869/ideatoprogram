"use client";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((data) => {
      if (data.error) { window.location.href = "/login"; return; }
      // If already chosen a path, go to dashboard
      if (data.user.chosenPath) { window.location.href = "/dashboard"; return; }
      setLoading(false);
    });
  }, []);

  async function choosePath(path: string) {
    setChoosing(true);
    await fetch("/api/choose-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    if (path === "python") window.location.href = "/lessons?tab=free";
    else if (path === "javascript") window.location.href = "/lessons?tab=free-js";
    else window.location.href = "/dashboard";
  }

  if (loading) return <div className="flex items-center justify-center min-h-[80vh] text-gray-400">Loading...</div>;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">IdeaToProgram</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">Choose your learning path to get started. You can always switch later.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Python */}
          <button onClick={() => choosePath("python")} disabled={choosing}
            className="bg-[#1e293b] border-2 border-[#334155] hover:border-yellow-500 rounded-2xl p-8 transition text-left group disabled:opacity-60">
            <div className="text-5xl mb-4">&#128013;</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition">Python</h2>
            <p className="text-gray-400 mb-4">Best for beginners, data science, AI, and automation.</p>
            <ul className="text-sm text-gray-500 space-y-1 mb-4">
              <li>&#10003; 10 free beginner lessons</li>
              <li>&#10003; 100 pro lessons</li>
              <li>&#10003; Hands-on challenges</li>
            </ul>
            <div className="text-yellow-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Start Python &rarr;
            </div>
          </button>

          {/* JavaScript */}
          <button onClick={() => choosePath("javascript")} disabled={choosing}
            className="bg-[#1e293b] border-2 border-[#334155] hover:border-blue-500 rounded-2xl p-8 transition text-left group disabled:opacity-60">
            <div className="text-5xl mb-4">&#9889;</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">JavaScript</h2>
            <p className="text-gray-400 mb-4">Best for web development, apps, and full-stack careers.</p>
            <ul className="text-sm text-gray-500 space-y-1 mb-4">
              <li>&#10003; 10 free beginner lessons</li>
              <li>&#10003; 100 pro lessons</li>
              <li>&#10003; Hands-on challenges</li>
            </ul>
            <div className="text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Start JavaScript &rarr;
            </div>
          </button>

          {/* Both */}
          <button onClick={() => choosePath("both")} disabled={choosing}
            className="bg-gradient-to-b from-indigo-600/10 to-purple-600/10 border-2 border-indigo-500/30 hover:border-indigo-500 rounded-2xl p-8 transition text-left group disabled:opacity-60">
            <div className="text-5xl mb-4">&#128640;</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition">Both</h2>
            <p className="text-gray-400 mb-4">Can&apos;t decide? Learn both and become a full-stack developer.</p>
            <ul className="text-sm text-gray-500 space-y-1 mb-4">
              <li>&#10003; 20 free beginner lessons</li>
              <li>&#10003; 200 pro lessons</li>
              <li>&#10003; Two complete tracks</li>
            </ul>
            <div className="text-indigo-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Start Both &rarr;
            </div>
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-8">You can access all paths anytime from the Lessons page. This just sets your default.</p>
      </div>
    </div>
  );
}
