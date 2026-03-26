"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  isPro: boolean;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setUser(data.user); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="border-b border-[#334155] bg-[#1e293b] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          IdeaToProgram
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/lessons" className="text-sm hover:text-indigo-400 transition">Lessons</Link>
          <Link href="/projects" className="text-sm hover:text-indigo-400 transition">Projects</Link>
          <Link href="/daily" className="text-sm hover:text-orange-400 transition">Daily</Link>
          <Link href="/vibe" className="text-sm font-medium bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent hover:from-pink-300 hover:to-orange-300 transition">Vibe Code</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-indigo-400 transition">Dashboard</Link>
              <Link href="/profile" className="text-sm hover:text-indigo-400 transition">Profile</Link>
              {!user.isPro && (
                <Link href="/pricing" className="text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition font-medium">
                  Upgrade
                </Link>
              )}
              {user.isPro && (
                <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-2 py-1 rounded-full">PRO</span>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 transition">Logout</button>
            </>
          ) : (
            <>
              <Link href="/upgrade" className="text-sm hover:text-indigo-400 transition">Pro</Link>
              <Link href="/login" className="text-sm px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition">Log In</Link>
              <Link href="/signup" className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#334155] bg-[#1e293b] px-4 py-4 space-y-3">
          <Link href="/lessons" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Lessons</Link>
          <Link href="/projects" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Projects</Link>
          <Link href="/daily" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-orange-400 transition">Daily Challenge</Link>
          <Link href="/vibe" onClick={() => setMenuOpen(false)} className="block text-sm font-medium bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Vibe Code ⚡</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Dashboard</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Profile</Link>
              <Link href="/certificate" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Certificates</Link>
              {!user.isPro && (
                <Link href="/upgrade" onClick={() => setMenuOpen(false)} className="block text-sm text-indigo-400 font-medium">Upgrade to Pro</Link>
              )}
              <button onClick={handleLogout} className="block text-sm text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-indigo-400 transition">Log In</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="block text-sm text-indigo-400 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
