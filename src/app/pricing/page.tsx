"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [user, setUser] = useState<{ isPro: boolean; subscriptions: { plan: string }[] } | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.error) setUser(d.user); }).catch(() => {});
  }, []);

  async function handleSubscribe(plan: string) {
    if (!user) { window.location.href = "/login"; return; }
    if (paying === plan && card.number.length >= 13) {
      setError("");
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, billing, cardNumber: card.number.replace(/\s/g, "") }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccess(plan);
        setPaying(null);
        setUser(data.user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Payment failed");
      }
    } else {
      setPaying(plan);
    }
  }

  const hasSub = (plan: string) => user?.subscriptions?.some((s) => s.plan === plan) || false;

  const plans = [
    { id: "pro_python", name: "Python Pro", desc: "100 Python lessons", monthly: 5, yearly: 50, yearlySave: 10, color: "yellow", icon: "🐍", features: ["100 Python pro lessons", "Guided projects", "Certificates", "Everything in Free"] },
    { id: "pro_javascript", name: "JavaScript Pro", desc: "100 JS lessons", monthly: 5, yearly: 50, yearlySave: 10, color: "blue", icon: "⚡", features: ["100 JavaScript pro lessons", "Guided projects", "Certificates", "Everything in Free"] },
    { id: "pro_all", name: "Pro All", desc: "All 210 lessons", monthly: 10, yearly: 100, yearlySave: 20, color: "indigo", icon: "🚀", featured: true, features: ["All 210 lessons", "Python + JavaScript", "All guided projects", "All certificates", "Everything in Free"] },
    { id: "vibe_pro", name: "Vibe Pro", desc: "Unlimited AI coding", monthly: 15, yearly: 150, yearlySave: 30, color: "pink", icon: "🤖", features: ["Unlimited AI prompts", "Vibe Code Studio", "Build anything with AI", "Separate from lesson plans"] },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Simple, Honest Pricing</h1>
        <p className="text-xl text-gray-400 mb-8">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-full p-1">
          <button onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${billing === "monthly" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
            Monthly
          </button>
          <button onClick={() => setBilling("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${billing === "yearly" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
            Yearly <span className="text-green-400 text-xs ml-1">Save up to $30</span>
          </button>
        </div>
      </div>

      {/* Free Tier */}
      <div className="mb-8 max-w-sm mx-auto">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">📚</div>
          <h3 className="text-lg font-bold">Free</h3>
          <div className="text-3xl font-extrabold my-2">$0</div>
          <p className="text-gray-400 text-sm mb-4">20 free lessons, 10 AI prompts, XP system</p>
          <Link href="/signup" className="block py-2 border border-[#334155] rounded-xl text-sm font-medium hover:border-indigo-500 transition">Get Started</Link>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {plans.map((plan) => {
          const price = billing === "yearly" ? plan.yearly : plan.monthly;
          const perMonth = billing === "yearly" ? Math.round(plan.yearly / 12 * 100) / 100 : plan.monthly;
          const active = hasSub(plan.id) || success === plan.id;

          return (
            <div key={plan.id} className={`rounded-2xl p-6 relative ${
              plan.featured
                ? "bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10"
                : "bg-[#1e293b] border border-[#334155]"
            }`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
              )}
              {billing === "yearly" && (
                <div className="absolute -top-3 right-4 bg-green-500 text-xs font-bold px-2 py-0.5 rounded-full text-black">Save ${plan.yearlySave}</div>
              )}
              <div className="text-2xl mb-2">{plan.icon}</div>
              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-xs mb-3">{plan.desc}</p>
              <div className="mb-1">
                <span className="text-3xl font-extrabold">${price}</span>
                <span className="text-gray-400 text-sm">/{billing === "yearly" ? "yr" : "mo"}</span>
              </div>
              {billing === "yearly" && <p className="text-xs text-gray-500 mb-4">${perMonth.toFixed(2)}/mo</p>}
              {billing === "monthly" && <p className="text-xs text-gray-500 mb-4">&nbsp;</p>}

              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>

              {active ? (
                <div className="py-2.5 text-center bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm font-bold">✓ Active</div>
              ) : paying === plan.id ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Demo: any 13+ digit card</p>
                  <input type="text" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
                    placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm focus:border-indigo-500 focus:outline-none" />
                  <div className="flex gap-2">
                    <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      placeholder="MM/YY" className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm focus:outline-none" />
                    <input type="text" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      placeholder="CVC" className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm focus:outline-none" />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${plan.featured ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
                    Pay ${price}
                  </button>
                  <button onClick={() => setPaying(null)} className="w-full py-1 text-xs text-gray-500 hover:text-white">Cancel</button>
                </div>
              ) : (
                <button onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${plan.featured ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
                  Subscribe
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Teams */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Team &amp; Classroom Plans</h2>
        <p className="text-gray-400 mb-4">Get CodeLearner Pro for your entire class or team. $5/student/month.</p>
        <p className="text-gray-500 text-sm mb-6">Includes all 210 lessons, progress tracking per student, and admin dashboard.</p>
        <a href="mailto:teams@codelearner.com" className="inline-block px-6 py-3 border border-[#334155] hover:border-indigo-500 rounded-xl font-medium transition">Contact Sales</a>
      </div>
    </div>
  );
}
