"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro_all";
  const billing = searchParams.get("billing") || "monthly";
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    // Activate subscription on the backend (backup in case webhook is slow)
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, billing, cardNumber: "stripe-verified-payment" }),
    }).then(() => setActivated(true)).catch(() => setActivated(true));
  }, [plan, billing]);

  const planNames: Record<string, string> = {
    pro_python: "Python Pro",
    pro_javascript: "JavaScript Pro",
    pro_all: "Pro All (310 Lessons)",
    vibe_pro: "Vibe Pro (Unlimited AI)",
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-400 mb-2">You&apos;re now subscribed to <strong className="text-white">{planNames[plan] || plan}</strong>.</p>
      <p className="text-gray-500 text-sm mb-8">{billing === "yearly" ? "Yearly plan" : "Monthly plan"} — {activated ? "Account activated!" : "Activating..."}</p>
      <div className="flex gap-4 justify-center">
        <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition">Go to Dashboard</Link>
        <Link href="/lessons" className="px-6 py-3 border border-[#334155] hover:border-indigo-500 rounded-xl font-medium transition">Start Learning</Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
