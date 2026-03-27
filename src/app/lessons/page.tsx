"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SPECIALIZATION_PATHS, ADVANCED_PYTHON, ADVANCED_JS } from "@/lib/paths";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  order: number;
}

interface User {
  isPro: boolean;
}

interface Progress {
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>}>
      <LessonsContent />
    </Suspense>
  );
}

function LessonsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "free";
  const [tab, setTab] = useState(initialTab);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allLessonsByTab, setAllLessonsByTab] = useState<Lesson[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.error) setUser(d.user); }).catch(() => {});
    fetch("/api/progress").then((r) => r.json()).then((d) => { if (d.progress) setProgress(d.progress); }).catch(() => {});
    fetch("/api/bookmarks").then((r) => r.json()).then((d) => { if (d.bookmarks) setBookmarks(d.bookmarks); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "paths" || tab === "advanced") {
      // These tabs don't load from the lessons module
      setAllLessonsByTab([]);
      setLessons([]);
      return;
    }
    import("@/lib/lessons").then((mod) => {
      let list: Lesson[];
      if (tab === "free") list = mod.getFreeLessons();
      else if (tab === "free-js") list = mod.getFreeJsLessons();
      else if (tab === "python") list = mod.getLessonsByCategory("python");
      else list = mod.getLessonsByCategory("javascript");
      setAllLessonsByTab(list);
      setLessons(list);
    });
  }, [tab]);

  useEffect(() => {
    if (!search.trim()) {
      setLessons(allLessonsByTab);
      return;
    }
    const q = search.toLowerCase();
    setLessons(allLessonsByTab.filter((l) =>
      l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    ));
  }, [search, allLessonsByTab]);

  async function toggleBookmark(e: React.MouseEvent, lessonId: string) {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    const data = await res.json();
    if (data.bookmarks) setBookmarks(data.bookmarks);
  }

  const tabs = [
    { id: "free", label: "Free Python", count: 10 },
    { id: "free-js", label: "Free JS", count: 10 },
    { id: "python", label: "Python Pro", count: 100 },
    { id: "javascript", label: "JS Pro", count: 100 },
    { id: "paths", label: "Specializations", count: 50 },
    { id: "advanced", label: "Advanced", count: 40 },
  ];

  const canAccess = (lesson: Lesson) => !lesson.isPro || user?.isPro;
  const isCompleted = (id: string) => progress?.completedLessons.includes(id) ?? false;
  const needsRedo = (id: string) => progress?.revealedAnswers.includes(id) ?? false;
  const isLocked = (lesson: Lesson) => {
    if (!progress) return lesson.order > 1;
    if (lesson.order <= 1) return false;
    const prefix = lesson.category === "free" ? "free-" : lesson.category === "free-js" ? "free-js-" : lesson.category === "python" ? "python-" : "js-";
    return !progress.completedLessons.includes(`${prefix}${lesson.order - 1}`);
  };

  const completedInTab = allLessonsByTab.filter((l) => isCompleted(l.id)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Lessons</h1>
          <p className="text-gray-400 text-sm mt-1">310+ lessons &bull; Python &bull; JavaScript</p>
        </div>
        {progress && (
          <div className="flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2">
            <span className="text-yellow-400">&#9733;</span>
            <span className="font-bold">{progress.xp} XP</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              tab === t.id ? "bg-indigo-600 text-white" : "bg-[#1e293b] text-gray-400 hover:text-white"
            }`}>
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {progress && !search && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">{completedInTab}/{allLessonsByTab.length} completed</span>
            <span className="text-gray-400">{allLessonsByTab.length > 0 ? Math.round((completedInTab / allLessonsByTab.length) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${allLessonsByTab.length > 0 ? (completedInTab / allLessonsByTab.length) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Results count */}
      {search && <p className="text-sm text-gray-400 mb-4">{lessons.length} result{lessons.length !== 1 ? "s" : ""} for &quot;{search}&quot;</p>}

      {/* Lesson Grid */}
      <div className="space-y-2">
        {lessons.map((lesson) => {
          const accessible = canAccess(lesson);
          const done = isCompleted(lesson.id);
          const redo = needsRedo(lesson.id);
          const gated = accessible && isLocked(lesson);
          const bookmarked = bookmarks.includes(lesson.id);

          return (
            <Link key={lesson.id}
              href={!accessible ? "/upgrade" : gated ? "#" : `/lessons/${lesson.id}`}
              onClick={gated ? (e) => e.preventDefault() : undefined}
              className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition ${
                done && !redo ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40"
                : accessible && !gated ? "bg-[#1e293b] border-[#334155] hover:border-indigo-500"
                : "bg-[#1e293b]/50 border-[#334155]/50 opacity-60"
              }`}>
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                done && !redo ? "bg-green-600" : gated ? "bg-gray-700" : accessible ? "bg-indigo-600" : "bg-gray-700"
              }`}>
                {done && !redo ? <span>&#10003;</span> : lesson.order}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-sm md:text-base">
                  {lesson.title}
                  {redo && <span className="text-yellow-400 text-xs ml-2">(redo)</span>}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 truncate">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {user && (
                  <button onClick={(e) => toggleBookmark(e, lesson.id)}
                    className={`text-sm transition ${bookmarked ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`}>
                    {bookmarked ? "★" : "☆"}
                  </button>
                )}
                <span className="text-xs text-yellow-400/70 hidden sm:inline">+{lesson.order * 10}</span>
                {lesson.isPro && !user?.isPro && (
                  <span className="text-xs bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded-full">PRO</span>
                )}
                {gated && <span className="text-gray-500 text-sm">&#128274;</span>}
                {accessible && !gated && <span className="text-indigo-400 hidden sm:inline">&rarr;</span>}
              </div>
            </Link>
          );
        })}
        {lessons.length === 0 && search && (
          <div className="text-center py-12 text-gray-500">No lessons match your search.</div>
        )}
      </div>

      {/* Specialization Paths Tab */}
      {tab === "paths" && (
        <div>
          <p className="text-gray-400 mb-6">Complete 100 pro lessons to unlock a specialization. Each path has 10 lessons + a capstone project + a certificate.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {SPECIALIZATION_PATHS.map((path) => (
              <Link key={path.id} href={`/paths/${path.id}`}
                className="bg-[#1e293b] border border-[#334155] hover:border-indigo-500 rounded-xl p-5 transition group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <h3 className="font-bold group-hover:text-indigo-400 transition">{path.name}</h3>
                    <span className="text-xs text-gray-500">{path.language === "python" ? "🐍 Python" : "⚡ JavaScript"} &bull; {path.lessons.length} lessons</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{path.description}</p>
                <div className="text-xs text-indigo-400">Capstone: {path.capstoneTitle} &bull; Certificate: {path.certificateName}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/paths" className="text-indigo-400 hover:underline text-sm">View all paths with full details &rarr;</Link>
          </div>
        </div>
      )}

      {/* Advanced Lessons Tab */}
      {tab === "advanced" && (
        <div>
          <p className="text-gray-400 mb-6">High-skill lessons for experienced developers. Staff and principal engineer level content.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🐍 Advanced Python <span className="text-sm font-normal text-gray-400">({ADVANCED_PYTHON.length})</span></h3>
              <div className="space-y-2">
                {ADVANCED_PYTHON.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-yellow-600/20 flex items-center justify-center text-xs font-bold text-yellow-400">{i + 1}</div>
                    <div>
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="text-xs text-gray-500">Advanced</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⚡ Advanced JavaScript <span className="text-sm font-normal text-gray-400">({ADVANCED_JS.length})</span></h3>
              <div className="space-y-2">
                {ADVANCED_JS.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-400">{i + 1}</div>
                    <div>
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="text-xs text-gray-500">Advanced</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
