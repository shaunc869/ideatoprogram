"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Challenge {
  date: string; title: string; prompt: string; starterCode: string;
  expectedOutput: string; language: string; difficulty: string; hint: string;
}

export default function DailyChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/daily-challenge").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
      fetch("/api/daily-challenge/submission").then((r) => r.json()).catch(() => ({})),
    ]).then(([challengeData, userData, subData]) => {
      if (challengeData.challenge) {
        setChallenge(challengeData.challenge);
        setCode(challengeData.challenge.starterCode || "");
      }
      if (!userData.error) setLoggedIn(true);
      if (subData.submission?.passed) {
        setAlreadyDone(true);
        setPassed(true);
        setCode(subData.submission.code);
      }
    });
  }, []);

  async function runCode() {
    if (!challenge) return;
    setRunning(true); setOutput(null); setError(null);
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: challenge.language }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else {
        setOutput(data.output);
        if (challenge.expectedOutput && data.output?.trim() === challenge.expectedOutput.trim()) {
          setPassed(true);
          if (loggedIn) {
            fetch("/api/daily-challenge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, passed: true }),
            });
          }
        }
      }
    } catch { setError("Failed to run code."); }
    finally { setRunning(false); }
  }

  if (!challenge) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading today&apos;s challenge...</div>;

  const diffColor = challenge.difficulty === "easy" ? "bg-green-500/20 text-green-400" : challenge.difficulty === "hard" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-block mb-3 px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm text-orange-300 font-medium">
          Daily Challenge &bull; {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{challenge.title}</h1>
        <div className="flex items-center justify-center gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${diffColor}`}>{challenge.difficulty}</span>
          <span className="text-sm text-yellow-400">+25 XP</span>
          <span className="text-xs text-gray-500">{challenge.language}</span>
        </div>
      </div>

      {alreadyDone && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <span className="text-green-400 font-bold">✓ Completed today! +25 XP earned</span>
        </div>
      )}

      <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5 mb-4">
        <p className="text-gray-200 font-medium text-lg">{challenge.prompt}</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setShowHint(!showHint)} className="text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
          💡 {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>

      {showHint && (
        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-base text-indigo-200">
          💡 <strong>Hint:</strong> {challenge.hint}
        </div>
      )}

      <div className="border border-[#334155] rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#334155]">
          <span className="text-xs text-gray-400 uppercase">{challenge.language}</span>
          <button onClick={runCode} disabled={running}
            className="text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-5 py-1.5 rounded-lg transition disabled:opacity-50">
            {running ? "Running..." : "▶ Run Code"}
          </button>
        </div>
        <div className="h-[280px]">
          <Editor height="100%" language={challenge.language} value={code}
            onChange={(v) => setCode(v || "")} theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 15, lineNumbers: "on", scrollBeyondLastLine: false, padding: { top: 12 }, automaticLayout: true }} />
        </div>
        <div className="border-t border-[#334155] bg-[#0d1117] p-4 min-h-[80px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Output</span>
            {passed && <span className="text-xs font-bold text-green-400">✓ Correct! 🎉</span>}
          </div>
          {output !== null && <pre className={`text-sm whitespace-pre-wrap ${passed ? "text-green-300" : "text-gray-300"}`}>{output || "(no output)"}</pre>}
          {error && <pre className="text-sm text-red-400 whitespace-pre-wrap">{error}</pre>}
          {output === null && !error && <p className="text-sm text-gray-600 italic">Click Run to see output</p>}
        </div>
      </div>

      {!loggedIn && <p className="text-center text-sm text-gray-500">Sign up to save your progress and earn XP! <a href="/signup" className="text-indigo-400 hover:underline">Sign up</a></p>}
    </div>
  );
}
