"use client";
import { useEffect, useState } from "react";

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.error) { window.location.href = "/login"; return; }
      setLoggedIn(true);
    });
    fetch("/api/referral").then((r) => r.json()).then((d) => {
      if (d.referralCode) setReferralCode(d.referralCode);
      if (d.referralCount !== undefined) setReferralCount(d.referralCount);
    }).catch(() => {});
  }, []);

  async function applyCode() {
    if (!inputCode.trim()) return;
    const res = await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: inputCode.trim() }),
    });
    const data = await res.json();
    if (data.success) setMessage("Referral applied! You both earned 5 bonus AI prompts 🎉");
    else setMessage(data.error || "Invalid or already used referral code.");
  }

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setMessage("Copied!");
    setTimeout(() => setMessage(""), 2000);
  }

  if (!loggedIn) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Refer Friends, Earn Rewards</h1>
        <p className="text-gray-400 text-lg">Share your code. Both you and your friend get <strong className="text-yellow-400">5 bonus AI prompts</strong>.</p>
      </div>

      {/* Your Code */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-lg mb-3">Your Referral Code</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl font-mono text-lg text-center tracking-wider">{referralCode}</div>
          <button onClick={copyCode} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition">Copy</button>
        </div>
        <p className="text-sm text-gray-400">Share this link with friends:</p>
        <div className="mt-2 px-3 py-2 bg-[#0f172a] rounded-lg text-sm text-indigo-400 break-all">
          codelearner.com/signup?ref={referralCode}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-indigo-400">{referralCount}</div>
          <div className="text-sm text-gray-400 mt-1">Friends Referred</div>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400">{referralCount * 5}</div>
          <div className="text-sm text-gray-400 mt-1">Bonus Prompts Earned</div>
        </div>
      </div>

      {/* Apply Code */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-3">Have a Referral Code?</h3>
        <div className="flex gap-3">
          <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter friend's code" className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-indigo-500 focus:outline-none" />
          <button onClick={applyCode} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition">Apply</button>
        </div>
        {message && <p className="mt-3 text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}
