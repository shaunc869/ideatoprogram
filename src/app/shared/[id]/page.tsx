"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-[#1e293b] border border-[#334155] rounded-lg flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  ),
});

interface SharedProject {
  title: string;
  authorName: string;
  language: string;
  sharedAt: string;
  code: string;
}

export default function SharedProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<SharedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/share?shareId=${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setProject(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const handleRunCode = useCallback(async () => {
    if (!project) return;
    setRunning(true);
    setOutput("");
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: project.code, language: project.language }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch {
      setOutput("Error running code");
    } finally {
      setRunning(false);
    }
  }, [project]);

  const handleCopy = useCallback(async () => {
    if (!project) return;
    await navigator.clipboard.writeText(project.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading project...</div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">This shared project could not be found.</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const languageColors: Record<string, string> = {
    python: "bg-yellow-500/20 text-yellow-300",
    javascript: "bg-yellow-400/20 text-yellow-200",
    typescript: "bg-blue-500/20 text-blue-300",
    html: "bg-orange-500/20 text-orange-300",
    css: "bg-blue-400/20 text-blue-200",
  };

  const badgeClass =
    languageColors[project.language.toLowerCase()] || "bg-indigo-500/20 text-indigo-300";

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>by {project.authorName}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>
              {project.language}
            </span>
            <span>Shared {new Date(project.sharedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden mb-4">
          <MonacoEditor
            height="400px"
            language={project.language.toLowerCase()}
            value={project.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleRunCode}
            disabled={running}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {running ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#1e293b] border border-[#334155] hover:border-indigo-500/50 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
          <Link
            href="/vibe"
            className="px-4 py-2 bg-[#1e293b] border border-[#334155] hover:border-indigo-500/50 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
          >
            Fork to Vibe Studio
          </Link>
        </div>

        {/* Output Panel */}
        {output && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Output</h3>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
