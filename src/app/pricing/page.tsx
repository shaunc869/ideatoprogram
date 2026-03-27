"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [user, setUser] = useState<{ isPro: boolean; subscriptions: { plan: string }[] } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [students, setStudents] = useState(5);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.error) setUser(d.user); }).catch(() => {});
  }, []);

  async function handleSubscribe(plan: string) {
    if (!user) { window.location.href = "/login"; return; }
    setLoadingPlan(plan);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, students: plan === "school" ? students : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoadingPlan(null);
    }
  }

  const hasSub = (plan: string) => user?.subscriptions?.some((s) => s.plan === plan) || false;

  const plans = [
    { id: "pro_python", name: "Python Pro", desc: "100 Python lessons", monthly: 5, yearly: 50, yearlySave: 10, icon: "🐍", features: ["100 Python pro lessons", "10 guided projects", "Completion certificate", "AI tutor on every lesson", "Everything in Free"] },
    { id: "pro_javascript", name: "JavaScript Pro", desc: "100 JS lessons", monthly: 5, yearly: 50, yearlySave: 10, icon: "⚡", features: ["100 JavaScript pro lessons", "10 guided projects", "Completion certificate", "AI tutor on every lesson", "Everything in Free"] },
    { id: "pro_all", name: "Pro All", desc: "All 760+ lessons", monthly: 10, yearly: 100, yearlySave: 20, icon: "🚀", featured: true, features: ["All 760+ lessons (Python + JS)", "20 guided projects", "All completion certificates", "Full AI Vibe Code access", "Priority AI tutor", "Everything in Free"] },
    { id: "vibe_pro", name: "Vibe Pro", desc: "Unlimited AI coding", monthly: 20.99, yearly: 150, yearlySave: 101.88, icon: "🤖", features: ["Unlimited AI prompts", "Advanced AI (Claude Sonnet)", "Full production-quality code", "Games with scoring & menus", "Apps with CRUD & search", "8x more code output vs free", "Vibe Code Studio"] },
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

      {error && <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm text-center">{error}</div>}

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
          const active = hasSub(plan.id);
          const isLoading = loadingPlan === plan.id;

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
              ) : (
                <button onClick={() => handleSubscribe(plan.id)} disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 ${
                    plan.featured
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}>
                  {isLoading ? "Redirecting to checkout..." : "Subscribe"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Specialization Paths */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Specialization Paths</h2>
          <p className="text-gray-400">100 lessons each. Choose one for $5/mo, or get all 5 for $300/yr.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {[
            { id: "spec_web_designer", name: "Web Designer", icon: "🎨" },
            { id: "spec_ai_ml", name: "AI & ML", icon: "🤖" },
            { id: "spec_game_dev", name: "Game Dev", icon: "🎮" },
            { id: "spec_data_engineer", name: "Data Engineer", icon: "📊" },
            { id: "spec_mobile_dev", name: "Mobile Dev", icon: "📱" },
          ].map((spec) => (
            <div key={spec.id} className={`bg-[#1e293b] border rounded-xl p-5 text-center ${
              hasSub(spec.id) ? "border-green-500/30" : "border-[#334155]"
            }`}>
              <div className="text-2xl mb-2">{spec.icon}</div>
              <h3 className="font-bold text-sm mb-1">{spec.name}</h3>
              <div className="text-lg font-extrabold mb-1">$5<span className="text-xs font-normal text-gray-400">/mo</span></div>
              <p className="text-xs text-gray-500 mb-3">100 lessons + capstone</p>
              {hasSub(spec.id) ? (
                <div className="py-1.5 text-center text-green-400 text-xs font-bold">✓ Active</div>
              ) : (
                <button onClick={() => handleSubscribe(spec.id)} disabled={loadingPlan === spec.id}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition disabled:opacity-50">
                  {loadingPlan === spec.id ? "..." : "Subscribe"}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="max-w-md mx-auto bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30 rounded-xl p-6 text-center">
          <div className="text-sm font-bold text-amber-400 mb-1">ALL 5 SPECIALIZATIONS</div>
          <div className="text-3xl font-extrabold mb-1">$300<span className="text-sm font-normal text-gray-400">/yr</span></div>
          <p className="text-xs text-gray-400 mb-3">500 lessons + 5 capstone projects + 5 certificates. Save $100 vs monthly.</p>
          {hasSub("spec_all") ? (
            <div className="py-2 text-center text-green-400 font-bold text-sm">✓ Active</div>
          ) : (
            <button onClick={() => { setBilling("yearly"); handleSubscribe("spec_all"); }} disabled={loadingPlan === "spec_all"}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg font-bold text-sm transition disabled:opacity-50">
              {loadingPlan === "spec_all" ? "Redirecting..." : "Get All Specializations - $300/yr"}
            </button>
          )}
        </div>
      </div>

      {/* Secure payment note */}
      <div className="text-center mb-16">
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          🔒 Secure payment powered by Stripe. We never see your card details.
        </p>
      </div>

      {/* School Plan */}
      <div className="bg-gradient-to-b from-emerald-600/10 to-teal-600/10 border-2 border-emerald-500/30 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🏫</div>
          <h2 className="text-2xl font-bold mb-2">School &amp; Classroom Plan</h2>
          <p className="text-gray-400">Give your entire class access to all 760+ lessons, projects, and certificates.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
            <h3 className="font-bold text-lg mb-1">Monthly</h3>
            <div className="text-3xl font-extrabold mb-1">$1<span className="text-lg font-normal text-gray-400">/student/mo</span></div>
            <p className="text-sm text-gray-500 mb-4">Minimum 5 students</p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of students</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setStudents(Math.max(5, students - 1))} className="w-10 h-10 bg-[#0f172a] border border-[#334155] rounded-lg text-lg hover:border-emerald-500 transition">-</button>
                <input type="number" min={5} value={students} onChange={(e) => setStudents(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-20 text-center px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-emerald-500 focus:outline-none text-lg font-bold" />
                <button onClick={() => setStudents(students + 1)} className="w-10 h-10 bg-[#0f172a] border border-[#334155] rounded-lg text-lg hover:border-emerald-500 transition">+</button>
              </div>
            </div>

            <div className="text-2xl font-bold text-emerald-400 mb-4">${students}/mo</div>

            <button onClick={() => handleSubscribe("school")} disabled={loadingPlan === "school"}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition disabled:opacity-50">
              {loadingPlan === "school" ? "Redirecting..." : `Subscribe for ${students} students`}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-[#1e293b] border border-emerald-500/30 rounded-xl p-6 relative">
            <div className="absolute -top-3 right-4 bg-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full text-black">BEST FOR SCHOOLS</div>
            <h3 className="font-bold text-lg mb-1">Yearly</h3>
            <div className="text-3xl font-extrabold mb-1">$1,500<span className="text-lg font-normal text-gray-400">/yr</span></div>
            <p className="text-sm text-emerald-400 font-medium mb-4">Unlimited students!</p>

            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Unlimited students</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> All 760+ lessons</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Progress tracking per student</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Admin dashboard</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Certificates for each student</li>
            </ul>

            <button onClick={() => { setBilling("yearly"); handleSubscribe("school"); }} disabled={loadingPlan === "school"}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition disabled:opacity-50">
              {loadingPlan === "school" ? "Redirecting..." : "Subscribe - $1,500/year"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
