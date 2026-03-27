"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SPECIALIZATION_PATHS, ADVANCED_PYTHON, ADVANCED_JS } from "@/lib/paths";

interface SpecPickStatus {
  eligible: boolean;
  picksRemaining: number;
  picks: string[];
}

export default function PathsPage() {
  const [specPick, setSpecPick] = useState<SpecPickStatus | null>(null);
  const [picking, setPicking] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/spec-pick").then((r) => r.json()).then((d) => {
      if (d.eligible !== undefined) setSpecPick(d);
    }).catch(() => {});
  }, []);

  async function claimFreeSpec(specId: string) {
    setPicking(specId);
    const res = await fetch("/api/spec-pick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId }),
    });
    const data = await res.json();
    if (data.success) {
      setSpecPick(data);
    }
    setPicking(null);
  }

  const hasFreeAccess = (id: string) => specPick?.picks?.includes(id) || false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Specialization Paths</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose a specialization path. 100 lessons each, with a capstone project and professional certificate.
        </p>
        <p className="text-gray-500 text-sm mt-2">$5/mo per path, or $300/yr for all 5. Available in Python &amp; JavaScript.</p>
      </div>

      {/* Free picks banner */}
      {specPick?.eligible && specPick.picksRemaining > 0 && (
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 mb-8 text-center">
          <div className="text-3xl mb-2">🎁</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">You&apos;ve Earned {specPick.picksRemaining} Free Specialization{specPick.picksRemaining > 1 ? "s" : ""}!</h3>
          <p className="text-gray-300">For completing 100 lessons (or being a Pro member), pick up to 2 specialization paths for free. Click &quot;Claim Free&quot; below.</p>
        </div>
      )}

      {specPick?.picks && specPick.picks.length > 0 && specPick.picksRemaining === 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8 text-center text-sm text-green-400">
          You&apos;ve claimed your 2 free specializations: {specPick.picks.map((p) => SPECIALIZATION_PATHS.find((sp) => sp.id === p)?.name).join(" & ")}
        </div>
      )}

      {/* Path Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SPECIALIZATION_PATHS.map((path) => (
          <div key={path.id} className="bg-[#1e293b] border border-[#334155] hover:border-indigo-500 rounded-2xl p-6 transition group">
            <Link href={`/paths/${path.id}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{path.icon}</div>
                {hasFreeAccess(path.id) && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">FREE ✓</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition">{path.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{path.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span>{path.lessons.length} lessons</span>
                <span>&bull;</span>
                <span>1 capstone</span>
                <span>&bull;</span>
                <span>🐍 Python &amp; ⚡ JS</span>
              </div>
              <div className="text-xs text-indigo-400 font-medium">
                Certificate: {path.certificateName}
              </div>
            </Link>

            {/* Claim free button */}
            {specPick?.eligible && specPick.picksRemaining > 0 && !hasFreeAccess(path.id) && (
              <button onClick={() => claimFreeSpec(path.id)} disabled={picking === path.id}
                className="mt-3 w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition disabled:opacity-50">
                {picking === path.id ? "Claiming..." : "🎁 Claim Free"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Advanced Lessons */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Advanced High-Skill Lessons</h2>
        <p className="text-gray-400 text-center mb-8">For experienced developers. Staff/principal engineer level. Available in both Python &amp; JavaScript.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🐍 Advanced Python <span className="text-sm font-normal text-gray-400">({ADVANCED_PYTHON.length})</span></h3>
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
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">⚡ Advanced JavaScript <span className="text-sm font-normal text-gray-400">({ADVANCED_JS.length})</span></h3>
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
          <div><div className="text-3xl font-extrabold text-pink-400">500</div><div className="text-sm text-gray-400">Specialization</div></div>
          <div><div className="text-3xl font-extrabold text-yellow-400">40</div><div className="text-sm text-gray-400">Advanced</div></div>
          <div><div className="text-3xl font-extrabold text-green-400">760</div><div className="text-sm text-gray-400">Total</div></div>
        </div>
      </div>
    </div>
  );
}
