"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  userId: string; name: string; email: string; role: string; xp: number; lessonsCompleted: number;
}

interface Team {
  id: string; name: string; joinCode: string; planType: string; maxSeats: number; members: Member[];
}

export default function SchoolPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/school").then((r) => r.json()),
    ]).then(([userData, schoolData]) => {
      if (userData.error) { window.location.href = "/login"; return; }
      setLoggedIn(true);
      if (schoolData.team) setTeam(schoolData.team);
      setLoading(false);
    });
  }, []);

  async function createSchool() {
    if (!schoolName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/school", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", schoolName, planType: "monthly", students: 5 }),
    });
    const data = await res.json();
    if (data.team) setTeam(data.team);
    setCreating(false);
  }

  function copyCode() {
    if (team) navigator.clipboard.writeText(team.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  if (!loggedIn) return null;

  // No school yet — show create or join options
  if (!team) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">&#127979;</div>
          <h1 className="text-3xl font-bold mb-3">School Dashboard</h1>
          <p className="text-gray-400">Create a school to manage students, or join an existing one.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-3">I&apos;m a Teacher</h3>
            <p className="text-gray-400 text-sm mb-4">Create a school and invite students with a code.</p>
            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School name" className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl mb-3 focus:border-emerald-500 focus:outline-none" />
            <button onClick={createSchool} disabled={creating || !schoolName.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition disabled:opacity-50">
              {creating ? "Creating..." : "Create School"}
            </button>
            <p className="text-xs text-gray-500 mt-2">Subscribe to a school plan on the <Link href="/pricing" className="text-emerald-400 hover:underline">pricing page</Link> to activate.</p>
          </div>

          {/* Join */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-3">I&apos;m a Student</h3>
            <p className="text-gray-400 text-sm mb-4">Got a code from your teacher? Join here.</p>
            <Link href="/school/join" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition text-center">
              Enter School Code
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Has a school — show dashboard
  const students = team.members.filter((m) => m.role === "student");
  const totalXp = students.reduce((sum, s) => sum + s.xp, 0);
  const totalLessons = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">&#127979; {team.name}</h1>
          <p className="text-gray-400">
            {team.planType === "yearly" ? "Unlimited students (yearly)" : `${students.length}/${team.maxSeats} students (monthly)`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Join Code</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400 tracking-wider">{team.joinCode}</span>
            <button onClick={copyCode} className="px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg text-sm hover:border-emerald-500 transition">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-emerald-400">{students.length}</div>
          <div className="text-sm text-gray-400">Students</div>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400">{totalXp}</div>
          <div className="text-sm text-gray-400">Total XP</div>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-indigo-400">{totalLessons}</div>
          <div className="text-sm text-gray-400">Lessons Done</div>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">{students.length > 0 ? Math.round(totalLessons / students.length) : 0}</div>
          <div className="text-sm text-gray-400">Avg Lessons</div>
        </div>
      </div>

      {/* Share code */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-8 text-center">
        <p className="text-emerald-300 font-medium mb-2">Share this code with your students:</p>
        <div className="font-mono text-4xl font-extrabold text-emerald-400 tracking-widest mb-2">{team.joinCode}</div>
        <p className="text-sm text-gray-400">Students go to <strong className="text-white">ideatoprogram.com/school/join</strong> and enter this code</p>
      </div>

      {/* Student List */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
          <h2 className="font-bold text-lg">Students</h2>
          <span className="text-sm text-gray-400">{students.length} enrolled</span>
        </div>
        {students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students yet. Share the join code to get started!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#334155] text-gray-400 text-left">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-right">XP</th>
                <th className="px-5 py-3 text-right">Lessons</th>
              </tr>
            </thead>
            <tbody>
              {students.sort((a, b) => b.xp - a.xp).map((s, i) => (
                <tr key={s.userId} className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50">
                  <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-gray-400">{s.email}</td>
                  <td className="px-5 py-3 text-right text-yellow-400 font-medium">{s.xp}</td>
                  <td className="px-5 py-3 text-right">{s.lessonsCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
