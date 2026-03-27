"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const router = useRouter();
  const [, setUser] = useState<{ isPro: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/login");
        } else {
          if (data.user.isPro) {
            setSuccess(true);
          }
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setProcessing(true);
    try {
      const res = await fetch("/api/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: card.number.replace(/\s/g, "") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setUser(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">&#127881;</div>
        <h1 className="text-3xl font-bold mb-4">You&apos;re a Pro!</h1>
        <p className="text-gray-400 mb-8">You now have lifetime access to all 310 lessons including 100 Python and 100 JavaScript pro lessons.</p>
        <div className="flex gap-4 justify-center">
          <a href="/lessons?tab=python" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">Start Python</a>
          <a href="/lessons?tab=javascript" className="px-6 py-3 border border-[#334155] hover:border-indigo-500 rounded-lg font-semibold transition">Start JavaScript</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Upgrade to Pro</h1>
        <p className="text-gray-400">One-time payment of <span className="text-white font-bold text-2xl">$10.00</span></p>
      </div>

      {/* What you get */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">What you&apos;ll unlock:</h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> 100 Python lessons (beginner to advanced)</li>
          <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> 100 JavaScript lessons (frontend to full-stack)</li>
          <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Code examples in every lesson</li>
          <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Lifetime access - pay once, learn forever</li>
          <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> All future lessons included</li>
        </ul>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleUpgrade} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h3 className="font-bold mb-4">Payment Details</h3>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        <p className="text-xs text-gray-500 mb-4">Demo mode: Enter any card number with 13+ digits to simulate payment.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <input type="text" required value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="4242 4242 4242 4242" maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry</label>
              <input type="text" required value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="MM/YY" maxLength={5} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVC</label>
              <input type="text" required value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="123" maxLength={4} />
            </div>
          </div>
          <button type="submit" disabled={processing}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition disabled:opacity-50 mt-2">
            {processing ? "Processing..." : "Pay $10.00 - Upgrade to Pro"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">Secure one-time payment. No recurring charges.</p>
      </form>
    </div>
  );
}
