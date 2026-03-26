"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Progress {
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

interface Certificate {
  track: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  completionDate: string | null;
}

export default function CertificatePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()).catch(() => ({ progress: null })),
    ]).then(([userData, progressData]) => {
      if (userData.error) {
        router.push("/login");
      } else {
        setUser(userData.user);
        if (progressData.progress) setProgress(progressData.progress);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }
  if (!user) return null;

  const completedLessons = progress?.completedLessons ?? [];

  function countCompleted(prefix: string): number {
    return completedLessons.filter((id) => id.startsWith(prefix)).length;
  }

  const certificates: Certificate[] = [
    {
      track: "free",
      title: "Free Track",
      totalLessons: 10,
      completedLessons: countCompleted("free-"),
      completionDate: countCompleted("free-") >= 10 ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null,
    },
    {
      track: "python",
      title: "Python Track",
      totalLessons: 100,
      completedLessons: countCompleted("python-"),
      completionDate: countCompleted("python-") >= 100 ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null,
    },
    {
      track: "javascript",
      title: "JavaScript Track",
      totalLessons: 100,
      completedLessons: countCompleted("js-"),
      completionDate: countCompleted("js-") >= 100 ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null,
    },
  ];

  const earnedCertificates = certificates.filter((c) => c.completionDate !== null);
  const inProgressCertificates = certificates.filter((c) => c.completionDate === null);

  function handlePrint(trackTitle: string) {
    const printContent = document.getElementById(`cert-${trackTitle}`);
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${trackTitle}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; font-family: Georgia, serif; }
            .cert { background: linear-gradient(135deg, #1e293b, #0f172a); border: 3px solid #6366f1; border-radius: 16px; padding: 60px; text-align: center; max-width: 700px; width: 100%; color: #e2e8f0; position: relative; }
            .cert::before { content: ''; position: absolute; inset: 8px; border: 1px solid #334155; border-radius: 12px; pointer-events: none; }
            .cert h1 { font-size: 14px; text-transform: uppercase; letter-spacing: 4px; color: #6366f1; margin-bottom: 8px; }
            .cert h2 { font-size: 32px; margin: 16px 0; color: #e2e8f0; }
            .cert .name { font-size: 28px; color: #a5b4fc; font-style: italic; margin: 24px 0; }
            .cert .track { font-size: 20px; color: #6366f1; font-weight: bold; margin: 16px 0; }
            .cert .date { font-size: 14px; color: #64748b; margin-top: 24px; }
            .cert .divider { width: 120px; height: 2px; background: #6366f1; margin: 20px auto; }
            @media print { body { background: white; } .cert { background: white; color: #1e293b; border-color: #6366f1; } .cert::before { border-color: #c7d2fe; } .cert .name { color: #4f46e5; } .cert .date { color: #64748b; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Dashboard
        </Link>
      </div>

      {earnedCertificates.length === 0 && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 text-center mb-8">
          <p className="text-gray-400 text-lg mb-2">No certificates earned yet</p>
          <p className="text-gray-500 text-sm mb-4">Complete all lessons in a track to earn your certificate.</p>
          <Link
            href="/lessons"
            className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium text-sm"
          >
            Continue Learning
          </Link>
        </div>
      )}

      {/* Earned Certificates */}
      {earnedCertificates.map((cert) => (
        <div key={cert.track} className="mb-8">
          <div
            id={`cert-${cert.title}`}
            className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-indigo-500 rounded-2xl p-12 text-center relative"
          >
            {/* Inner decorative border */}
            <div className="absolute inset-3 border border-[#334155] rounded-xl pointer-events-none" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[4px] text-indigo-400 mb-2">Certificate of Completion</p>
              <div className="w-24 h-0.5 bg-indigo-600 mx-auto my-4" />
              <h2 className="text-3xl font-bold mb-6">CodeLearner</h2>
              <p className="text-gray-400 mb-2">This is to certify that</p>
              <p className="text-2xl font-semibold text-indigo-300 italic my-4">{user.name}</p>
              <p className="text-gray-400 mb-2">has successfully completed the</p>
              <p className="text-xl font-bold text-indigo-400 my-4">{cert.title}</p>
              <p className="text-gray-400 mb-1">
                completing all {cert.totalLessons} lessons
              </p>
              <div className="w-24 h-0.5 bg-indigo-600 mx-auto my-6" />
              <p className="text-sm text-gray-500">{cert.completionDate}</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePrint(cert.title)}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium text-sm"
            >
              Download / Print
            </button>
          </div>
        </div>
      ))}

      {/* In-Progress Tracks */}
      {inProgressCertificates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="grid gap-4">
            {inProgressCertificates.map((cert) => {
              const pct = Math.round((cert.completedLessons / cert.totalLessons) * 100);
              return (
                <div
                  key={cert.track}
                  className="bg-[#1e293b] border border-[#334155] rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{cert.title}</h3>
                    <span className="text-sm text-gray-400">
                      {cert.completedLessons} / {cert.totalLessons} lessons
                    </span>
                  </div>
                  <div className="w-full bg-[#0f172a] rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{pct}% complete</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Profile
        </Link>
        <Link
          href="/leaderboard"
          className="px-4 py-2 rounded-lg border border-[#334155] hover:border-indigo-500 transition text-sm"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
