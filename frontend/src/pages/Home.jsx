import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const codeLines = [
  { text: 'function twoSum(nums, target) {', color: 'text-cyan-400' },
  { text: '  const map = new Map();', color: 'text-white' },
  { text: '  for (let i = 0; i < nums.length; i++) {', color: 'text-white' },
  { text: '    const comp = target - nums[i];', color: 'text-green-400' },
  { text: '    if (map.has(comp)) {', color: 'text-yellow-400' },
  { text: '      return [map.get(comp), i];', color: 'text-green-400' },
  { text: '    }', color: 'text-yellow-400' },
  { text: '    map.set(nums[i], i);', color: 'text-white' },
  { text: '  }', color: 'text-white' },
  { text: '}', color: 'text-cyan-400' },
  { text: '// ✅ Accepted! Runtime: 72ms', color: 'text-green-400' },
]

const features = [
  {
    icon: '⚡',
    title: 'Real Interview Problems',
    desc: 'Curated DSA problems from Google, Amazon, Microsoft & more.',
    img: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png'
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Get instant hints, approach explanations and complexity analysis.',
    img: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'
  },
  {
    icon: '🏆',
    title: 'Track Progress',
    desc: 'Detailed stats on your solving history, streaks, and skill breakdown.',
    img: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png'
  },
]

const topics = [
  { icon: '📦', label: 'Arrays' },
  { icon: '🔗', label: 'Linked List' },
  { icon: '🌳', label: 'Trees' },
  { icon: '📊', label: 'Graphs' },
  { icon: '💡', label: 'Dynamic Programming' },
  { icon: '🔍', label: 'Binary Search' },
  { icon: '📚', label: 'Stack & Queue' },
  { icon: '🧮', label: 'Math' },
]

const companies = [
  { name: 'Google', color: 'text-blue-400' },
  { name: 'Amazon', color: 'text-yellow-400' },
  { name: 'Microsoft', color: 'text-cyan-400' },
  { name: 'Meta', color: 'text-blue-500' },
  { name: 'Apple', color: 'text-gray-300' },
  { name: 'Netflix', color: 'text-red-400' },
]

export default function Home() {
  const { dark } = useTheme()
  const [visibleLines, setVisibleLines] = useState(0)
  const [typed, setTyped] = useState('')
  const fullText = 'Practice Coding, Crack Interviews'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) { setTyped(fullText.slice(0, i)); i++ }
      else clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < codeLines.length) { setVisibleLines(v => v + 1); i++ }
      else clearInterval(interval)
    }, 220)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`pt-14 ${dark ? 'bg-[#0d1117]' : 'bg-[#f0f4f8]'}`}>

      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-full mb-6">
              🚀 AI-Powered DSA Learning Platform
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 min-h-[150px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                {typed}
              </span>
              <span className="animate-pulse text-cyan-400">|</span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
              Master Data Structures & Algorithms with AI-guided learning, real interview problems, and instant feedback.
            </p>

            <div className="flex items-center gap-4 mb-10">
              <Link to="/problems"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-400/25 text-sm">
                Start Solving →
              </Link>
              <Link to="/dashboard"
                className="border border-gray-700 text-white font-medium px-8 py-3.5 rounded-xl hover:border-cyan-400/50 hover:text-cyan-400 transition text-sm">
                View Dashboard
              </Link>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <span key={t.label} className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#161b22] border border-gray-800 px-3 py-1.5 rounded-full hover:border-cyan-400/40 hover:text-cyan-400 transition cursor-pointer">
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Code Editor */}
          <div className="relative">
            <div className="absolute -top-5 -right-5 bg-green-400/10 border border-green-400/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full z-10 animate-bounce shadow-lg">
              ✅ Accepted!
            </div>
            <div className="absolute -bottom-5 -left-5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
              🤖 AI Hint Available
            </div>

            <div className="bg-[#161b22] border border-gray-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-gray-500 font-mono">solution.js — Two Sum</span>
                <span className="ml-auto text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded">JavaScript</span>
              </div>
              <div className="p-5 font-mono text-sm leading-7 min-h-[260px]">
                {codeLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className={`${line.color}`}>
                    <span className="text-gray-700 select-none mr-4 text-xs">{i + 1}</span>
                    {line.text}
                  </div>
                ))}
                {visibleLines < codeLines.length && <span className="animate-pulse text-cyan-400">▋</span>}
              </div>
              <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border-t border-gray-800">
                <div className="flex gap-3">
                  <span className="text-xs text-gray-500">⏱ <span className="text-green-400">72ms</span></span>
                  <span className="text-xs text-gray-500">💾 <span className="text-green-400">42.1MB</span></span>
                </div>
                <span className="text-xs text-green-400 font-semibold">Beats 94% 🎉</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted by companies ── */}
      <section className="border-y border-gray-800/60 py-8 bg-[#0d1117]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-6">Problems asked at top companies</p>
          <div className="flex flex-wrap justify-center gap-8">
            {companies.map(c => (
              <span key={c.name} className={`text-lg font-black ${c.color} opacity-60 hover:opacity-100 transition`}>{c.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Illustration + Features ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-3">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">succeed</span></h2>
          <p className="text-gray-400">Built for developers who want to crack FAANG interviews</p>
        </div>

        {/* Big illustration row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/programmer-working-on-laptop-illustration-download-in-svg-png-gif-file-formats--coding-developer-web-development-pack-illustrations-3723737.png"
              alt="Developer coding"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
              onError={e => e.target.style.display = 'none'}
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-cyan-400/30 transition">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
              <div>
                <h3 className="text-white font-semibold mb-1">75+ DSA Topics Covered</h3>
                <p className="text-gray-400 text-sm">Arrays, Trees, Graphs, DP, Backtracking, Greedy and more — all in one place.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-cyan-400/30 transition">
              <div className="w-12 h-12 bg-purple-400/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
              <div>
                <h3 className="text-white font-semibold mb-1">AI-Powered Hints</h3>
                <p className="text-gray-400 text-sm">Stuck? Ask the AI assistant for hints, approach, time complexity — without spoiling the solution.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-cyan-400/30 transition">
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📊</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Track Your Progress</h3>
                <p className="text-gray-400 text-sm">Visual dashboard with solved count, streaks, skill breakdown and recent submissions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards with images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/5 transition group text-center">
              <img src={f.img} alt={f.title} className="w-16 h-16 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition"
                onError={e => { e.target.style.display = 'none' }} />
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-cyan-400 transition">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/20 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-400/10 blur-3xl" />
          </div>
          <div className="relative z-10">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/success-illustration-download-in-svg-png-gif-file-formats--achievement-goal-target-winner-pack-business-illustrations-3723740.png"
              alt="Success"
              className="w-32 h-32 mx-auto mb-6 drop-shadow-xl"
              onError={e => e.target.style.display = 'none'}
            />
            <h2 className="text-3xl font-black text-white mb-3">Ready to crack your dream job? 🚀</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of developers practicing DSA daily and landing offers at top tech companies.</p>
            <Link to="/signup"
              className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-12 py-4 rounded-xl hover:opacity-90 transition shadow-xl shadow-cyan-400/25 text-base">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
