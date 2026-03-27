"use client";
import { useState, useRef, useEffect } from "react";

interface AIChatProps {
  lessonTitle: string;
  language: string;
  code?: string;
  challengePrompt?: string;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AIChat({ lessonTitle, language, code, challengePrompt }: AIChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: `Hi! I'm your AI helper. I can help with:\n\n• **Coding** — explain concepts, debug code, solve challenges\n• **Platform** — pricing, plans, how to sign up, Vibe Code, specializations\n\nWhat do you need help with?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          lessonTitle,
          language,
          code,
          challengePrompt,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.response || "Sorry, I couldn't process that. Try asking differently!" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  }

  // Quick question buttons
  const quickQuestions = [
    "I'm stuck on the challenge",
    "Explain the main concept",
    "My code has an error",
    "What are the Pro benefits?",
    "How does Vibe Code work?",
    "Tell me about specializations",
  ];

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <div className="bg-[#1e293b] border border-[#334155] text-white text-sm font-medium px-3 py-2 rounded-xl shadow-lg animate-bounce">
            Need help? Ask AI &rarr;
          </div>
          <button
            onClick={() => setOpen(true)}
            className="w-16 h-16 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all duration-300 ring-4 ring-indigo-500/20 hover:ring-indigo-500/40 hover:scale-110"
          >
            <span className="text-lg font-extrabold">AI</span>
          </button>
        </div>
      )}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-all duration-300 text-xl"
        >
          &times;
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#334155] bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">AI</div>
              <div>
                <div className="font-bold text-sm">AI Helper</div>
                <div className="text-xs text-gray-400">Coding help &amp; platform guide</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-[#0f172a] border border-[#334155] text-gray-300"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1">
              {quickQuestions.map((qq) => (
                <button
                  key={qq}
                  onClick={() => { setInput(qq); }}
                  className="text-xs bg-[#0f172a] border border-[#334155] text-gray-400 hover:text-white hover:border-indigo-500 px-2 py-1 rounded-lg transition"
                >
                  {qq}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-[#334155] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
