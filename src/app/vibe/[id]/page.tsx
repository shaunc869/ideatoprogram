"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Project {
  id: string;
  title: string;
  language: string;
  code: string;
}

interface Usage {
  allowed: boolean;
  used: number;
  limit: number;
  unlimited: boolean;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  code?: string | null;
}

export default function VibeEditorPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const projectId = params.id as string;
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ error: true })),
      fetch("/api/vibe/projects").then((r) => r.json()).catch(() => ({ projects: [] })),
    ]).then(([userData, projectData]) => {
      if (userData.error) { window.location.href = "/login"; return; }
      const found = projectData.projects?.find((p: Project) => p.id === projectId);
      if (!found) { window.location.href = "/vibe"; return; }
      setProject(found);
      setCode(found.code || "");
      setTitle(found.title);

      // Check vibe usage
      const isUnlimited = userData.user?.isVibeUnlimited;
      if (isUnlimited) {
        setUsage({ allowed: true, used: 0, limit: 0, unlimited: true });
      }

      setMessages([{
        role: "ai",
        text: `Welcome to **${found.title}**! I'm your AI coding partner. Tell me what you want to build and I'll write the code for you.\n\nTry: "Build me a calculator" or "Make a guessing game" or "Add a save feature to this code"`,
      }]);

      setLoading(false);
    });
  }, [params.id]);

  // Auto-save code
  const autoSave = useCallback((newCode: string) => {
    if (!project) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/vibe/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, code: newCode, prompt: "", language: project.language }),
      }).catch(() => {});
      // Actually just save directly
      fetch(`/api/save-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: `vibe-${project.id}`, code: newCode }),
      }).catch(() => {});
    }, 2000);
  }, [project]);

  function handleCodeChange(val: string | undefined) {
    const newCode = val || "";
    setCode(newCode);
    autoSave(newCode);
  }

  async function runCode() {
    setRunning(true);
    setOutput(null);
    setError(null);
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: project?.language }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setOutput(data.output);
    } catch {
      setError("Failed to run code.");
    } finally {
      setRunning(false);
    }
  }

  async function askAI() {
    if (!prompt.trim() || aiLoading || !project) return;
    const userPrompt = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", text: userPrompt }]);
    setAiLoading(true);

    try {
      const res = await fetch("/api/vibe/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, code, language: project.language, projectId: project.id }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "ai", text: data.error }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "ai",
          text: data.response.message,
          code: data.response.code,
        }]);
        // Auto-insert generated code into editor
        if (data.response.code) {
          setCode(data.response.code);
        }
        if (data.usage) setUsage(data.usage);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Try again!" }]);
    } finally {
      setAiLoading(false);
    }
  }

  async function saveTitle() {
    if (!project || !title.trim()) return;
    setEditingTitle(false);
    // Save via projects API update - we'll just save with code
    fetch("/api/vibe/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, code, language: project.language, prompt: "" }),
    }).catch(() => {});
  }

  const quickPrompts = [
    "Build me a calculator",
    "Make a guessing game",
    "Create a todo list",
    "Build a quiz game",
    "Make a password generator",
    "Create tic-tac-toe",
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  if (!project) return null;

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col md:flex-row overflow-hidden">
      {/* Left: AI Chat Panel */}
      <div className="w-full md:w-[400px] flex-shrink-0 border-r border-[#334155] bg-[#1e293b] flex flex-col h-[40vh] md:h-full">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-[#334155] bg-gradient-to-r from-pink-600/20 to-orange-600/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold">AI</div>
            <div>
              <div className="font-bold text-sm">Vibe Coder</div>
              <div className="text-xs text-gray-400">Tell me what to build</div>
            </div>
          </div>
          {usage && !usage.unlimited && (
            <div className="text-xs text-gray-400 bg-[#0f172a] px-2 py-1 rounded-lg">
              {usage.limit - usage.used}/{usage.limit} prompts
            </div>
          )}
          {usage?.unlimited && (
            <div className="text-xs text-pink-400 bg-pink-500/10 px-2 py-1 rounded-lg font-bold">UNLIMITED</div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-pink-600 to-orange-600 text-white"
                  : "bg-[#0f172a] border border-[#334155] text-gray-300"
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.code && (
                  <div className="mt-2 bg-[#161b22] rounded-lg p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500">Generated Code</span>
                      <span className="text-green-400 text-xs">&#10003; Applied to editor</span>
                    </div>
                    <pre className="text-green-300 overflow-x-auto max-h-[120px]">{msg.code.slice(0, 300)}{msg.code.length > 300 ? "..." : ""}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 2 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1 flex-shrink-0">
            {quickPrompts.map((qp) => (
              <button key={qp} onClick={() => setPrompt(qp)}
                className="text-xs bg-[#0f172a] border border-[#334155] text-gray-400 hover:text-pink-400 hover:border-pink-500/50 px-2 py-1 rounded-lg transition">
                {qp}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); askAI(); }} className="p-3 border-t border-[#334155] flex gap-2 flex-shrink-0">
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell AI what to build..."
            className="flex-1 px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-sm focus:border-pink-500 focus:outline-none" />
          <button type="submit" disabled={aiLoading || !prompt.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl text-sm font-bold transition disabled:opacity-40">
            Send
          </button>
        </form>
      </div>

      {/* Right: Editor + Output */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Header */}
        <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#334155] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {editingTitle ? (
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle} onKeyDown={(e) => e.key === "Enter" && saveTitle()} autoFocus
                className="px-2 py-1 bg-[#0f172a] border border-pink-500 rounded text-sm focus:outline-none" />
            ) : (
              <button onClick={() => setEditingTitle(true)} className="font-medium text-sm hover:text-pink-400 transition">{title}</button>
            )}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              project.language === "python" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
            }`}>
              {project.language}
            </span>
            <span className="text-xs text-gray-600">auto-saved</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode("")} className="text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded hover:bg-[#334155]">Clear</button>
            <button onClick={runCode} disabled={running}
              className="text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-5 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5">
              {running ? (
                <><span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> Running...</>
              ) : (
                <>&#9654; Run</>
              )}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={project.language === "python" ? "python" : "javascript"}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              automaticLayout: true,
              tabSize: project.language === "python" ? 4 : 2,
              wordWrap: "on",
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="h-[180px] flex-shrink-0 border-t border-[#334155] bg-[#0d1117] flex flex-col">
          <div className="px-4 py-2 border-b border-[#334155] flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-gray-400 font-medium">Output</span>
            {output !== null && <button onClick={() => { setOutput(null); setError(null); }} className="text-xs text-gray-500 hover:text-white">Clear</button>}
          </div>
          <div className="flex-1 overflow-auto p-4">
            {output !== null && <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output || "(no output)"}</pre>}
            {error && <pre className="text-sm text-red-400 whitespace-pre-wrap">{error}</pre>}
            {output === null && !error && (
              <p className="text-sm text-gray-600 italic">Click &quot;Run&quot; to see output, or ask AI to build something!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
