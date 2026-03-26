"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: "python" | "javascript";
  initialCode: string;
  expectedOutput?: string;
  lessonId?: string;
  onSuccess?: () => void;
  onCodeChange?: (code: string) => void;
}

function friendlyError(error: string, language: string): string {
  const e = error.toLowerCase();
  let friendly = "";

  if (language === "python") {
    if (e.includes("syntaxerror")) friendly = "💡 Syntax Error: Check for missing colons, parentheses, or quotes.";
    else if (e.includes("nameerror")) {
      const match = error.match(/name '(\w+)' is not defined/);
      friendly = match ? `💡 "${match[1]}" is not defined. Did you spell it correctly? Remember Python is case-sensitive.` : "💡 You're using a variable that hasn't been created yet. Check your spelling.";
    }
    else if (e.includes("typeerror")) friendly = "💡 Type Error: You're trying to use a value in a way that doesn't work. Check if you're mixing strings and numbers.";
    else if (e.includes("indentationerror")) friendly = "💡 Indentation Error: Python uses spaces to group code. Make sure lines inside if/for/def are indented with 4 spaces.";
    else if (e.includes("zerodivisionerror")) friendly = "💡 You're trying to divide by zero! Add a check before dividing.";
    else if (e.includes("indexerror")) friendly = "💡 Index Error: You're trying to access an item that doesn't exist in your list. Remember lists start at index 0.";
    else if (e.includes("keyerror")) friendly = "💡 Key Error: That key doesn't exist in your dictionary. Check the spelling or use .get() instead.";
    else if (e.includes("attributeerror")) friendly = "💡 Attribute Error: That method or property doesn't exist. Check the documentation for the correct name.";
    else if (e.includes("valueerror")) friendly = "💡 Value Error: The value you passed isn't the right type. For example, int(\"hello\") won't work.";
  } else {
    if (e.includes("syntaxerror") || e.includes("unexpected token")) friendly = "💡 Syntax Error: Check for missing brackets, semicolons, or quotes.";
    else if (e.includes("is not defined")) {
      const match = error.match(/(\w+) is not defined/);
      friendly = match ? `💡 "${match[1]}" is not defined. Did you declare it with let/const? Check spelling.` : "💡 You're using a variable that hasn't been declared yet.";
    }
    else if (e.includes("typeerror")) friendly = "💡 Type Error: You're calling something that isn't a function, or accessing a property on undefined/null.";
    else if (e.includes("referenceerror")) friendly = "💡 Reference Error: A variable or function you're using hasn't been defined yet.";
    else if (e.includes("rangeerror")) friendly = "💡 Range Error: A number is outside the allowed range, or you have infinite recursion.";
  }

  if (friendly) return friendly + "\n\n--- Original Error ---\n" + error;
  return error;
}

export default function CodeEditor({ language, initialCode, expectedOutput, lessonId, onSuccess, onCodeChange }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const editorRef = useRef<unknown>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved code
  useEffect(() => {
    if (!lessonId) { setLoaded(true); return; }
    fetch(`/api/save-code?lessonId=${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.code) setCode(data.code);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [lessonId]);

  // Auto-save with debounce
  const autoSave = useCallback((newCode: string) => {
    if (!lessonId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      fetch("/api/save-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, code: newCode }),
      }).catch(() => {});
    }, 1500);
  }, [lessonId]);

  function handleCodeChange(val: string | undefined) {
    const newCode = val || "";
    setCode(newCode);
    onCodeChange?.(newCode);
    autoSave(newCode);
  }

  async function runCode() {
    setRunning(true);
    setOutput(null);
    setError(null);
    setPassed(false);

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();

      if (data.error) {
        setError(friendlyError(data.error, language));
        try { new Audio("data:audio/wav;base64,UklGRl9vT19teleAQBYAAAEAEAEAgO4BAIAAAABQAAAEABAAAAAA").play(); } catch {}
      } else {
        setOutput(data.output);
        if (expectedOutput && data.output?.trim() === expectedOutput.trim()) {
          setPassed(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          try { new Audio("data:audio/wav;base64,UklGRl9vT19WAVdBVkVmbXQg").play(); } catch {}
          onSuccess?.();
        }
      }
    } catch {
      setError("Failed to run code. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  function resetCode() {
    setCode(initialCode);
    setOutput(null);
    setError(null);
    setPassed(false);
  }

  const monacoLang = language === "python" ? "python" : "javascript";

  if (!loaded) return <div className="h-[400px] bg-[#0d1117] border border-[#334155] rounded-xl animate-pulse" />;

  return (
    <div className="border border-[#334155] rounded-xl overflow-hidden relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="absolute animate-bounce" style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              fontSize: `${12 + Math.random() * 12}px`,
            }}>
              {["🎉", "⭐", "🎊", "✨", "💫", "🏆"][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium uppercase">{language}</span>
          {lessonId && <span className="text-xs text-gray-600">Auto-saved</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetCode} className="text-xs text-gray-400 hover:text-white transition px-3 py-1 rounded hover:bg-[#334155]">Reset</button>
          <button onClick={runCode} disabled={running}
            className="text-xs font-medium bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded transition disabled:opacity-50 flex items-center gap-1">
            {running ? (
              <><span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> Running...</>
            ) : (
              <>&#9654; Run Code</>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[280px]">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={handleCodeChange}
          onMount={(editor) => { editorRef.current = editor; }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            automaticLayout: true,
            tabSize: language === "python" ? 4 : 2,
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="border-t border-[#334155] bg-[#0d1117]">
        <div className="px-4 py-2 border-b border-[#334155] flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Output</span>
          {passed && <span className="text-xs font-bold text-green-400 flex items-center gap-1">&#10003; Correct! 🎉</span>}
          {output !== null && expectedOutput && !passed && (
            <span className="text-xs font-bold text-yellow-400">Output doesn&apos;t match expected result</span>
          )}
        </div>
        <div className="p-4 min-h-[80px] max-h-[200px] overflow-auto">
          {output !== null && (
            <pre className={`text-sm whitespace-pre-wrap ${passed ? "text-green-300" : "text-gray-300"}`}>{output || "(no output)"}</pre>
          )}
          {error && <pre className="text-sm text-red-400 whitespace-pre-wrap">{error}</pre>}
          {output === null && !error && (
            <p className="text-sm text-gray-500 italic">Click &quot;Run Code&quot; to see output</p>
          )}
        </div>
        {expectedOutput && (
          <div className="px-4 pb-3">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-300">Expected Output</summary>
              <pre className="mt-2 text-gray-400 bg-[#161b22] p-2 rounded">{expectedOutput}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
