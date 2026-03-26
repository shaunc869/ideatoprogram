"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VibeUpgradePage() {
  const [, setUser] = useState<{ isVibeUnlimited: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((data) => {
      if (data.error) { window.location.href = "/login"; return; }
      if (data.user.isVibeUnlimited) setSuccess(true);
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setProcessing(true);
    try {
      const res = await fetch("/api/vibe/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: card.number.replace(/\s/g, "") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">&#9889;</div>
        <h1 className="text-3xl font-bold mb-4">You&apos;re a Vibe Pro!</h1>
        <p className="text-gray-400 mb-8">You now have unlimited AI prompts in Vibe Code Studio. Build anything you can imagine.</p>
        <Link href="/vibe" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl font-bold transition">
          Start Vibe Coding &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Upgrade to{" "}
          <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Vibe Pro</span>
        </h1>
        <p className="text-xl text-gray-400">Unlimited AI-powered coding. Build anything, anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
        {/* Free */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <div className="text-4xl font-extrabold mb-1">$0</div>
          <div className="text-gray-500 text-sm mb-6">forever</div>
          <ul className="space-y-3 text-gray-400 mb-8">
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Vibe Code Studio access</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Built-in code editor</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Run Python &amp; JavaScript</li>
            <li className="flex items-center gap-3"><span className="text-yellow-400">&#9888;</span> 10 AI prompts total</li>
            <li className="text-gray-600 flex items-center gap-3"><span>&#10007;</span> Basic AI (simple code only)</li>
            <li className="text-gray-600 flex items-center gap-3"><span>&#10007;</span> Full production-quality code</li>
            <li className="text-gray-600 flex items-center gap-3"><span>&#10007;</span> Advanced AI model</li>
          </ul>
          <div className="py-3 text-center text-gray-500 border border-[#334155] rounded-xl">Current Plan</div>
        </div>

        {/* Vibe Pro */}
        <div className="bg-gradient-to-b from-pink-600/20 to-orange-600/20 border-2 border-pink-500 rounded-2xl p-8 relative shadow-lg shadow-pink-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-500 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            UNLIMITED AI
          </div>
          <h3 className="text-xl font-bold mb-2">Vibe Pro</h3>
          <div className="text-4xl font-extrabold mb-1">$20.99</div>
          <div className="text-gray-400 text-sm mb-6">one-time payment</div>
          <ul className="space-y-3 text-gray-300 mb-8">
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Everything in Free</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> <strong>Unlimited</strong> AI prompts</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> <strong>Advanced AI</strong> (Claude Sonnet)</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Full production-quality code</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Games with scoring, menus &amp; levels</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Apps with CRUD, search &amp; persistence</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> 8x more code output vs free</li>
            <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Lifetime access</li>
          </ul>
          <form onSubmit={handleUpgrade} className="space-y-3">
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
            <p className="text-xs text-gray-500">Demo: enter any card number with 13+ digits.</p>
            <input type="text" required value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-pink-500 focus:outline-none"
              placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" required value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-pink-500 focus:outline-none" placeholder="MM/YY" />
              <input type="text" required value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-pink-500 focus:outline-none" placeholder="CVC" />
            </div>
            <button type="submit" disabled={processing}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl font-bold transition disabled:opacity-50">
              {processing ? "Processing..." : "Pay $20.99 — Unlock Unlimited AI"}
            </button>
          </form>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">See the Difference</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <div className="text-sm font-bold text-gray-400 mb-3">FREE: &quot;Build me a calculator&quot;</div>
            <div className="bg-[#0d1117] rounded-lg p-4 text-xs font-mono text-gray-400 leading-relaxed">
              <div className="text-gray-600"># Basic calculator</div>
              <div>a = 10</div>
              <div>b = 5</div>
              <div>print(a + b)</div>
              <div>print(a - b)</div>
              <div>print(a * b)</div>
              <div className="mt-2 text-gray-600">~ 6 lines, hardcoded values</div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-pink-600/10 to-orange-600/10 border border-pink-500/30 rounded-2xl p-6">
            <div className="text-sm font-bold text-pink-400 mb-3">PRO: &quot;Build me a calculator&quot;</div>
            <div className="bg-[#0d1117] rounded-lg p-4 text-xs font-mono text-green-300 leading-relaxed">
              <div className="text-gray-500"># Full interactive calculator</div>
              <div>class Calculator:</div>
              <div className="pl-4">def __init__(self):</div>
              <div className="pl-8">self.history = []</div>
              <div className="pl-4">def add(self, a, b): ...</div>
              <div className="pl-4">def subtract(self, a, b): ...</div>
              <div className="pl-4">def multiply(self, a, b): ...</div>
              <div className="pl-4">def divide(self, a, b): ...</div>
              <div className="pl-4">def power(self, a, b): ...</div>
              <div className="pl-4">def show_history(self): ...</div>
              <div className="pl-4">def clear_history(self): ...</div>
              <div className="mt-1 text-gray-500"># + menu, input loop, error</div>
              <div className="text-gray-500"># handling, memory, replay...</div>
              <div className="mt-2 text-pink-400">~ 80+ lines, full featured</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
