import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto relative text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300">
            &#127891; Trusted by 10,000+ learners worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Learn to Code.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master Python and JavaScript with <strong className="text-white">760+ hands-on lessons</strong>, a built-in code editor, and an AI tutor that helps you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
              Start Learning Free &#8594;
            </Link>
            <Link href="/lessons" className="px-8 py-4 border border-[#334155] hover:border-indigo-500 rounded-xl font-bold text-lg transition bg-[#1e293b]/50 backdrop-blur">
              Browse 760+ Lessons
            </Link>
          </div>
          <p className="text-sm text-gray-500">No credit card required. 10 lessons completely free.</p>
        </div>
      </section>

      {/* Editor Preview */}
      <section className="py-4 px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0d1117] border border-[#334155] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#334155]">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-gray-500">lesson_01.py &#8212; IdeaToProgram</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-gray-500"># &#127891; Your first Python program</div>
              <div><span className="text-purple-400">def</span> <span className="text-yellow-300">greet</span><span className="text-gray-400">(</span><span className="text-orange-300">name</span><span className="text-gray-400">):</span></div>
              <div className="pl-8"><span className="text-purple-400">return</span> <span className="text-green-400">f&quot;Hello, &#123;name&#125;! Welcome to IdeaToProgram &#127881;&quot;</span></div>
              <div className="mt-2"><span className="text-blue-400">print</span><span className="text-gray-400">(</span><span className="text-yellow-300">greet</span><span className="text-gray-400">(</span><span className="text-green-400">&quot;You&quot;</span><span className="text-gray-400">))</span></div>
              <div className="mt-4 pt-4 border-t border-[#334155]">
                <span className="text-gray-500">&#9654; Output:</span>
                <div className="text-green-400 mt-1">Hello, You! Welcome to IdeaToProgram &#127881;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why IdeaToProgram */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why IdeaToProgram?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to go from zero to professional developer, all in one platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-indigo-600/30 transition">&#128187;</div>
              <h3 className="text-xl font-bold mb-3">Built-In Code Editor</h3>
              <p className="text-gray-400 leading-relaxed">Write and run real Python and JavaScript code directly in your browser. No setup needed &#8212; just code and learn.</p>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-green-600/30 transition">&#127942;</div>
              <h3 className="text-xl font-bold mb-3">XP &amp; Level System</h3>
              <p className="text-gray-400 leading-relaxed">Earn XP for every lesson you complete. Level up, track your progress, and stay motivated with gamified learning.</p>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-purple-600/30 transition">&#129302;</div>
              <h3 className="text-xl font-bold mb-3">AI Tutor</h3>
              <p className="text-gray-400 leading-relaxed">Stuck on a problem? Ask our AI tutor for help. It explains concepts, debugs your code, and guides you to the answer.</p>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-yellow-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-yellow-600/30 transition">&#128218;</div>
              <h3 className="text-xl font-bold mb-3">760+ Hands-On Lessons</h3>
              <p className="text-gray-400 leading-relaxed">From &quot;Hello World&quot; to building full-stack apps. Every lesson has reading material, code examples, and a coding challenge.</p>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-600/30 transition">&#128640;</div>
              <h3 className="text-xl font-bold mb-3">Learn by Doing</h3>
              <p className="text-gray-400 leading-relaxed">No boring lectures. Every lesson ends with a challenge you must solve. You learn by writing real code, not watching videos.</p>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/50 transition group">
              <div className="w-14 h-14 bg-pink-600/20 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-pink-600/30 transition">&#128176;</div>
              <h3 className="text-xl font-bold mb-3">Crazy Affordable</h3>
              <p className="text-gray-400 leading-relaxed">Just $10. One time. Forever. No subscriptions, no hidden fees. Other platforms charge $30+/month for less content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-t border-b border-[#334155] bg-[#1e293b]/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">760+</div>
            <div className="text-gray-400 mt-2">Lessons</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">2</div>
            <div className="text-gray-400 mt-2">Languages</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">10k+</div>
            <div className="text-gray-400 mt-2">Students</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">5</div>
            <div className="text-gray-400 mt-2">Specializations</div>
          </div>
        </div>
      </section>

      {/* Specialization Paths */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Specialize &amp; Get Certified</h2>
            <p className="text-gray-400 text-lg">After 100 lessons, choose a career path. Complete it. Earn a professional certificate.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/paths/web-designer" className="bg-[#1e293b] border border-[#334155] hover:border-pink-500/50 rounded-xl p-5 text-center transition group">
              <div className="text-3xl mb-2">&#127912;</div>
              <h3 className="font-bold group-hover:text-pink-400 transition">Web Designer</h3>
              <p className="text-xs text-gray-500 mt-1">100 lessons + capstone</p>
            </Link>
            <Link href="/paths/ai-ml" className="bg-[#1e293b] border border-[#334155] hover:border-purple-500/50 rounded-xl p-5 text-center transition group">
              <div className="text-3xl mb-2">&#129302;</div>
              <h3 className="font-bold group-hover:text-purple-400 transition">AI &amp; ML</h3>
              <p className="text-xs text-gray-500 mt-1">100 lessons + capstone</p>
            </Link>
            <Link href="/paths/game-dev" className="bg-[#1e293b] border border-[#334155] hover:border-green-500/50 rounded-xl p-5 text-center transition group">
              <div className="text-3xl mb-2">&#127918;</div>
              <h3 className="font-bold group-hover:text-green-400 transition">Game Dev</h3>
              <p className="text-xs text-gray-500 mt-1">100 lessons + capstone</p>
            </Link>
            <Link href="/paths/data-engineer" className="bg-[#1e293b] border border-[#334155] hover:border-blue-500/50 rounded-xl p-5 text-center transition group">
              <div className="text-3xl mb-2">&#128202;</div>
              <h3 className="font-bold group-hover:text-blue-400 transition">Data Engineer</h3>
              <p className="text-xs text-gray-500 mt-1">100 lessons + capstone</p>
            </Link>
            <Link href="/paths/mobile-dev" className="bg-[#1e293b] border border-[#334155] hover:border-cyan-500/50 rounded-xl p-5 text-center transition group">
              <div className="text-3xl mb-2">&#128241;</div>
              <h3 className="font-bold group-hover:text-cyan-400 transition">Mobile Dev</h3>
              <p className="text-xs text-gray-500 mt-1">100 lessons + capstone</p>
            </Link>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">+ 40 advanced high-skill lessons for experienced developers</p>
            <Link href="/paths" className="text-indigo-400 text-sm hover:underline mt-1 inline-block">Explore all paths &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Vibe Code CTA */}
      <section className="py-20 px-4 border-t border-[#334155]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-600/20 via-orange-600/10 to-yellow-600/20 border border-pink-500/30 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-block mb-4 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300 font-bold">
                &#9889; NEW FEATURE
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Vibe Code{" "}
                <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Studio</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                Tell the AI what you want to build and watch it write the code. A whole new way to learn &mdash; by vibing, not grinding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vibe" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 rounded-xl font-bold text-lg transition shadow-lg shadow-pink-500/25">
                  Try Vibe Code Free
                </Link>
                <Link href="/vibe/upgrade" className="px-8 py-3 border border-pink-500/30 hover:border-pink-500 rounded-xl font-bold text-lg transition">
                  Go Unlimited &mdash; $20.99
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">10 free AI prompts. No credit card needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Learn */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Complete Learning Paths</h2>
            <p className="text-gray-400 text-lg">Master the two most in-demand programming languages on the planet.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Python */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-3xl">&#128013;</div>
                <div>
                  <h3 className="text-2xl font-bold">Python</h3>
                  <p className="text-yellow-400 text-sm font-medium">100 Pro Lessons</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> Core Python fundamentals &amp; OOP</li>
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> Web development with Flask &amp; Django</li>
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> Data science with Pandas &amp; NumPy</li>
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> APIs, databases, testing &amp; deployment</li>
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> Machine learning &amp; automation</li>
                <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">&#10003;</span> Career prep &amp; portfolio project</li>
              </ul>
              <div className="text-sm text-gray-500">Perfect for: data science, backend development, automation, AI</div>
            </div>
            {/* JavaScript */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">&#9889;</div>
                <div>
                  <h3 className="text-2xl font-bold">JavaScript</h3>
                  <p className="text-blue-400 text-sm font-medium">100 Pro Lessons</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> Modern ES6+ JavaScript fundamentals</li>
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> React, Next.js &amp; frontend frameworks</li>
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> Node.js, Express &amp; backend development</li>
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> TypeScript, testing &amp; build tools</li>
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> Databases, auth &amp; real-time apps</li>
                <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">&#10003;</span> Full-stack project &amp; interview prep</li>
              </ul>
              <div className="text-sm text-gray-500">Perfect for: web development, full-stack apps, mobile with React Native</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#1e293b]/30 border-t border-[#334155]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Learners Say</h2>
            <p className="text-gray-400 text-lg">Join thousands who changed their careers with IdeaToProgram.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f172a] border border-[#334155] rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="text-gray-300 mb-6 leading-relaxed">&quot;I went from zero coding knowledge to landing my first developer job in 6 months. The hands-on challenges made all the difference.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-white">SM</div>
                <div>
                  <div className="font-medium text-sm">Sarah M.</div>
                  <div className="text-xs text-gray-500">Junior Developer @ Shopify</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] border border-[#334155] rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="text-gray-300 mb-6 leading-relaxed">&quot;The XP system kept me motivated when things got tough. I actually looked forward to learning every day. Best $10 I ever spent.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-sm font-bold text-white">JT</div>
                <div>
                  <div className="font-medium text-sm">James T.</div>
                  <div className="text-xs text-gray-500">CS Student @ UCLA</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] border border-[#334155] rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="text-gray-300 mb-6 leading-relaxed">&quot;The AI tutor is a game changer. It&apos;s like having a patient mentor available 24/7. Explained things my bootcamp couldn&apos;t.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold text-white">KL</div>
                <div>
                  <div className="font-medium text-sm">Kim L.</div>
                  <div className="text-xs text-gray-500">Career Changer, ex-Teacher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">IdeaToProgram vs. The Rest</h2>
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                  <th className="p-4 text-center text-indigo-400 font-bold">IdeaToProgram</th>
                  <th className="p-4 text-center text-gray-500 font-medium">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                <tr>
                  <td className="p-4">Price</td>
                  <td className="p-4 text-center font-bold text-green-400">$10 one-time</td>
                  <td className="p-4 text-center text-gray-500">$30-50/month</td>
                </tr>
                <tr>
                  <td className="p-4">Built-in Code Editor</td>
                  <td className="p-4 text-center text-green-400">&#10003;</td>
                  <td className="p-4 text-center text-gray-500">Some</td>
                </tr>
                <tr>
                  <td className="p-4">AI Tutor</td>
                  <td className="p-4 text-center text-green-400">&#10003;</td>
                  <td className="p-4 text-center text-red-400">&#10007;</td>
                </tr>
                <tr>
                  <td className="p-4">XP &amp; Gamification</td>
                  <td className="p-4 text-center text-green-400">&#10003;</td>
                  <td className="p-4 text-center text-gray-500">Limited</td>
                </tr>
                <tr>
                  <td className="p-4">Coding Challenges</td>
                  <td className="p-4 text-center text-green-400">Every lesson</td>
                  <td className="p-4 text-center text-gray-500">Some lessons</td>
                </tr>
                <tr>
                  <td className="p-4">Lifetime Access</td>
                  <td className="p-4 text-center text-green-400">&#10003;</td>
                  <td className="p-4 text-center text-red-400">&#10007;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-[#334155]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Honest Pricing</h2>
          <p className="text-gray-400 text-lg mb-12">Start free. Upgrade when you&apos;re ready. No tricks.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-5xl font-extrabold mb-2">$0</div>
              <div className="text-gray-500 text-sm mb-6">forever</div>
              <ul className="text-left text-gray-400 space-y-3 mb-8">
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> 10 beginner-friendly lessons</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Built-in code editor</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> AI tutor access</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> XP tracking &amp; progress</li>
                <li className="text-gray-600 flex items-center gap-3"><span>&#10007;</span> Python pro lessons</li>
                <li className="text-gray-600 flex items-center gap-3"><span>&#10007;</span> JavaScript pro lessons</li>
              </ul>
              <Link href="/signup" className="block w-full py-3 border border-[#334155] rounded-xl font-semibold hover:border-indigo-500 transition text-center">
                Start Free
              </Link>
            </div>
            <div className="bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500 rounded-2xl p-8 relative shadow-lg shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                BEST VALUE
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-5xl font-extrabold mb-2">$10</div>
              <div className="text-gray-400 text-sm mb-6">one-time payment, lifetime access</div>
              <ul className="text-left text-gray-300 space-y-3 mb-8">
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Everything in Free</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> <strong>100 Python</strong> pro lessons</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> <strong>100 JavaScript</strong> pro lessons</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Lifetime access forever</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> All future lessons included</li>
                <li className="flex items-center gap-3"><span className="text-green-400">&#10003;</span> Priority AI tutor</li>
              </ul>
              <Link href="/upgrade" className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold transition text-center shadow-lg shadow-indigo-500/25">
                Upgrade to Pro &#8212; $10
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-[#334155]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Coding?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of learners who are building real skills with IdeaToProgram. Your first 10 lessons are completely free.
          </p>
          <Link href="/signup" className="inline-block px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-500/25">
            Create Your Free Account &#8594;
          </Link>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span>&#10003; No credit card</span>
            <span>&#10003; 10 free lessons</span>
            <span>&#10003; AI tutor included</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[#334155] bg-[#0f172a]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">IdeaToProgram</div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/lessons" className="hover:text-white transition">Lessons</Link>
            <Link href="/upgrade" className="hover:text-white transition">Pricing</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
            <Link href="/login" className="hover:text-white transition">Log In</Link>
          </div>
          <p className="text-sm text-gray-600">&copy; 2026 IdeaToProgram. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
