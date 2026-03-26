"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });
const Comments = dynamic(() => import("@/components/Comments"), { ssr: false });

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  order: number;
  content: string;
  codeExample: string;
}

interface Challenge {
  id: string;
  lessonId: string;
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  language: "python" | "javascript";
}

interface Progress {
  userId: string;
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealedSolution, setRevealedSolution] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [locked, setLocked] = useState(false);
  const [requiredXp, setRequiredXp] = useState(0);
  const [mustRedo, setMustRedo] = useState(false);
  const [editorCode, setEditorCode] = useState("");

  useEffect(() => {
    const lessonId = params.id as string;

    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
      import("@/lib/lessons"),
      fetch(`/api/challenge?lessonId=${lessonId}`).then((r) => r.json()).catch(() => ({})),
      fetch("/api/progress").then((r) => r.json()).catch(() => ({ progress: null })),
    ]).then(([userData, mod, challengeData, progressData]) => {
      const found = mod.getLessonById(lessonId);
      if (!found) { router.push("/lessons"); return; }
      if (found.isPro && !userData.user?.isPro) { router.push("/upgrade"); return; }

      setLesson(found);
      const categoryLessons = mod.getLessonsByCategory(found.category);
      setAllLessons(categoryLessons);

      if (challengeData.challenge) {
        setChallenge(challengeData.challenge);
        setEditorCode(challengeData.challenge.starterCode);
      }

      const prog = progressData.progress;
      if (prog) {
        setProgress(prog);
        setCompleted(prog.completedLessons.includes(lessonId));
        setMustRedo(prog.revealedAnswers.includes(lessonId));

        if (found.order > 1) {
          const needed = (found.order - 1) * 10;
          setRequiredXp(needed);
          const categoryPrefix = found.category === "free" ? "free-" : found.category === "free-js" ? "free-js-" : found.category === "python" ? "python-" : "js-";
          const prevLessonId = `${categoryPrefix}${found.order - 1}`;
          if (!prog.completedLessons.includes(prevLessonId)) {
            setLocked(true);
          }
        }
      }

      setLoading(false);
    });
  }, [params.id, router]);

  const handleChallengeSuccess = useCallback(async () => {
    if (completed && !mustRedo) return;

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson?.id, lessonOrder: lesson?.order }),
      });
      const data = await res.json();
      if (data.progress) {
        setProgress(data.progress);
        setCompleted(true);
        setMustRedo(false);
        setXpEarned(data.xpEarned);
        setRevealedSolution(null);
      }
    } catch {}
  }, [completed, mustRedo, lesson]);

  const handleRevealAnswer = async () => {
    if (!progress || progress.xp < 5) return;
    setRevealing(true);
    try {
      const res = await fetch("/api/reveal-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson?.id }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setRevealedSolution(data.solution);
        setProgress(data.progress);
        setCompleted(false);
        setMustRedo(true);
      }
    } catch {} finally {
      setRevealing(false);
    }
  };

  if (loading || !lesson) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const nextIsLocked = nextLesson && !progress?.completedLessons.includes(lesson.id);

  const categoryLabel = lesson.category === "free" ? "Free Python" : lesson.category === "free-js" ? "Free JS" : lesson.category === "python" ? "Python" : "JavaScript";
  const categoryColor = lesson.category === "free" ? "text-green-400" : lesson.category === "free-js" ? "text-blue-400" : lesson.category === "python" ? "text-yellow-400" : "text-blue-400";
  const challengeLang = (lesson.category === "javascript" || lesson.category === "free-js") ? "javascript" : "python";

  // Locked lesson gate
  if (locked) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">&#128274;</div>
        <h1 className="text-2xl font-bold mb-4">Lesson Locked</h1>
        <p className="text-gray-400 mb-2">
          You need to complete <strong className="text-white">Lesson {lesson.order - 1}</strong> first to unlock this lesson.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Required: Complete the previous lesson&apos;s challenge to earn {requiredXp} XP
        </p>
        {prevLesson && (
          <Link href={`/lessons/${prevLesson.id}`} className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">
            Go to Lesson {lesson.order - 1}: {prevLesson.title}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* AI Chat */}
      <AIChat
        lessonTitle={lesson.title}
        language={challengeLang}
        code={editorCode}
        challengePrompt={challenge?.prompt}
      />

      {/* XP Bar */}
      {progress && (
        <div className="mb-6 flex items-center justify-between bg-[#1e293b] border border-[#334155] rounded-xl px-5 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">&#9733;</span>
              <span className="font-bold text-lg">{progress.xp} XP</span>
            </div>
            <div className="h-5 w-px bg-[#334155]" />
            <span className="text-sm text-gray-400">{progress.completedLessons.length} lessons completed</span>
          </div>
          {completed && !mustRedo && (
            <span className="text-green-400 font-bold text-sm flex items-center gap-1">&#10003; Completed</span>
          )}
          {mustRedo && (
            <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">&#9888; Must redo (answer revealed)</span>
          )}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/lessons" className="hover:text-white transition">Lessons</Link>
        <span>/</span>
        <Link href={`/lessons?tab=${lesson.category}`} className={`hover:text-white transition ${categoryColor}`}>{categoryLabel}</Link>
        <span>/</span>
        <span className="text-white">Lesson {lesson.order}</span>
      </div>

      {/* Header + Prev/Next Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${lesson.isPro ? "bg-indigo-600" : "bg-green-600"}`}>
            {lesson.isPro ? "PRO" : "FREE"}
          </span>
          <span className="text-sm text-gray-400">Lesson {lesson.order} of {allLessons.length}</span>
          <span className="text-sm text-yellow-400">+{lesson.order * 10} XP</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{lesson.title}</h1>
            <p className="text-gray-400 text-lg md:text-xl">{lesson.description}</p>
          </div>

          {/* Prev / Next buttons beside the title */}
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b] border border-[#334155] hover:border-indigo-500 rounded-xl text-sm font-medium transition"
                title={prevLesson.title}>
                <span>&larr;</span> <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <div className="px-4 py-2.5 bg-[#1e293b]/50 border border-[#334155]/50 rounded-xl text-sm text-gray-600 cursor-default">
                <span>&larr;</span> <span className="hidden sm:inline">Prev</span>
              </div>
            )}

            {nextLesson ? (
              nextIsLocked && !completed ? (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b]/50 border border-[#334155]/50 rounded-xl text-sm text-gray-600 cursor-default"
                  title="Complete this lesson to unlock">
                  <span className="hidden sm:inline">Next</span> &#128274;
                </div>
              ) : (
                <Link href={`/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition"
                  title={nextLesson.title}>
                  <span className="hidden sm:inline">Next</span> <span>&rarr;</span>
                </Link>
              )
            ) : (
              <Link href="/lessons"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b] border border-[#334155] hover:border-indigo-500 rounded-xl text-sm font-medium transition">
                All Lessons
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 mb-8">
        <div className="prose prose-invert max-w-none whitespace-pre-line text-gray-300 leading-relaxed text-base md:text-lg">
          {lesson.content}
        </div>
      </div>

      {/* ====== CHALLENGE + EDITOR + HINTS AT TOP ====== */}
      {challenge && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              &#127947; Challenge
              <span className="text-sm font-normal text-yellow-400">+{lesson.order * 10} XP</span>
            </h2>
            {completed && !mustRedo && xpEarned > 0 && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                +{xpEarned} XP earned!
              </div>
            )}
          </div>

          {/* Challenge Prompt */}
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5 mb-4">
            <p className="text-gray-200 font-medium text-base md:text-lg">{challenge.prompt}</p>
          </div>

          {/* Hint & Answer Key — RIGHT BELOW PROMPT */}
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <button onClick={() => setShowHint(!showHint)}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
              &#128161; {showHint ? "Hide Hint" : "Show Hint"}
            </button>

            {progress && !revealedSolution && (
              <button
                onClick={handleRevealAnswer}
                disabled={revealing || progress.xp < 5}
                className="text-sm text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &#128273; Answer Key (-5 XP)
                {progress.xp < 5 && <span className="text-xs text-red-400 ml-1">(need 5 XP)</span>}
              </button>
            )}

            {mustRedo && !revealedSolution && (
              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
                &#9888; Complete challenge to regain credit
              </span>
            )}
          </div>

          {showHint && (
            <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-base text-indigo-200">
              &#128161; <strong>Hint:</strong> {challenge.hint}
            </div>
          )}

          {revealedSolution && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-yellow-400">&#128273; Answer Key (-5 XP)</span>
                <span className="text-xs text-yellow-400/70">You must redo this lesson to get credit</span>
              </div>
              <pre className="text-sm text-yellow-200 bg-[#0d1117] rounded-lg p-3 overflow-x-auto">{revealedSolution}</pre>
            </div>
          )}

          {/* Code Editor */}
          <CodeEditor
            language={challenge.language}
            initialCode={challenge.starterCode}
            expectedOutput={challenge.expectedOutput}
            lessonId={lesson.id}
            onSuccess={handleChallengeSuccess}
            onCodeChange={setEditorCode}
          />
        </div>
      )}

      {/* Completion Status */}
      {completed && !mustRedo && (
        <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">&#127881;</div>
          <h3 className="text-xl font-bold text-green-400 mb-1">Lesson Complete!</h3>
          <p className="text-gray-400">You earned <strong className="text-yellow-400">{lesson.order * 10} XP</strong> for this lesson.</p>
        </div>
      )}

      {/* ====== REFERENCE CODE AT BOTTOM ====== */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">&#128214; Reference Code</h2>
        <div className="bg-[#0d1117] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#334155]">
            <span className="text-xs text-gray-400">{(lesson.category === "javascript" || lesson.category === "free-js") ? "JavaScript" : "Python"} — Example</span>
            <button onClick={() => navigator.clipboard.writeText(lesson.codeExample)}
              className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-[#334155]">
              Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-green-300">{lesson.codeExample}</code>
          </pre>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <Comments lessonId={lesson.id} />
      </div>

    </div>
  );
}
