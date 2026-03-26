"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  isVibeUnlimited: boolean;
}

interface Project {
  id: string;
  title: string;
  language: string;
  code: string;
  updatedAt: string;
}

export default function VibePage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLang, setNewLang] = useState("python");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
      fetch("/api/vibe/projects").then((r) => r.json()).catch(() => ({ projects: [] })),
    ]).then(([userData, projectData]) => {
      if (userData.error) {
        window.location.href = "/login";
        return;
      }
      setUser(userData.user);
      if (projectData.projects) setProjects(projectData.projects);
      setLoading(false);
    });
  }, []);

  async function createProject() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/vibe/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, language: newLang }),
      });
      const data = await res.json();
      if (data.project) {
        window.location.href = `/vibe/${data.project.id}`;
      }
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300 font-medium">
          &#9889; NEW &mdash; Vibe Code with AI
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Vibe Code{" "}
          <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Studio
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Tell the AI what you want to build and watch it code it for you. Learn by vibing &mdash; describe it, see it, tweak it, run it.
        </p>
        {!user.isVibeUnlimited && (
          <div className="mt-4 inline-flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-full px-4 py-2 text-sm">
            <span className="text-gray-400">Free: 10 AI prompts</span>
            <span className="text-gray-600">|</span>
            <Link href="/vibe/upgrade" className="text-pink-400 hover:text-pink-300 font-medium">Upgrade for unlimited &rarr;</Link>
          </div>
        )}
        {user.isVibeUnlimited && (
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-full px-4 py-2 text-sm">
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-bold">VIBE PRO</span>
            <span className="text-gray-400">Unlimited AI prompts</span>
          </div>
        )}
      </div>

      {/* New Project Button */}
      <div className="mb-8">
        {!showCreate ? (
          <button onClick={() => setShowCreate(true)}
            className="w-full py-4 border-2 border-dashed border-[#334155] hover:border-pink-500/50 rounded-2xl text-gray-400 hover:text-pink-400 transition text-lg font-medium">
            + Create New Project
          </button>
        ) : (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">New Project</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                placeholder="My Awesome Project" autoFocus
                className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-pink-500 focus:outline-none text-base"
              />
              <select value={newLang} onChange={(e) => setNewLang(e.target.value)}
                className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-pink-500 focus:outline-none">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button onClick={createProject} disabled={creating || !newTitle.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl font-bold transition disabled:opacity-50">
                {creating ? "Creating..." : "Create"}
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-3 text-gray-400 hover:text-white transition">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/vibe/${project.id}`}
                className="bg-[#1e293b] border border-[#334155] hover:border-pink-500/50 rounded-2xl p-5 transition group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    project.language === "python" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {project.language === "python" ? "Python" : "JavaScript"}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-pink-400 transition">{project.title}</h3>
                <div className="text-xs text-gray-500 font-mono truncate">
                  {project.code ? project.code.split("\n")[0] || "Empty project" : "Empty project"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">&#128640;</div>
          <h3 className="text-xl font-bold mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Create your first project and start vibe coding with AI!</p>
          <button onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl font-bold transition">
            Create Your First Project
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="mt-16 bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How Vibe Coding Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">&#128172;</div>
            <h3 className="font-bold mb-2">1. Describe It</h3>
            <p className="text-gray-400 text-sm">Tell the AI what you want to build in plain English. &quot;Build me a calculator&quot; or &quot;Make a guessing game&quot;.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">&#9889;</div>
            <h3 className="font-bold mb-2">2. AI Codes It</h3>
            <p className="text-gray-400 text-sm">The AI writes real working code for you. It appears in the editor ready to run.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">&#128640;</div>
            <h3 className="font-bold mb-2">3. Run &amp; Remix</h3>
            <p className="text-gray-400 text-sm">Run the code, see it work, then ask AI to change or add features. Learn by experimenting!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
