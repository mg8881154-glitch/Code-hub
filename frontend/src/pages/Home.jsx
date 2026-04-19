import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const codeLines = [
  { text: 'function twoSum(nums, target) {', color: 'text-cyan-400' },
  { text: '  const map = new Map();', color: 'text-white' },
  { text: '  for (let i = 0; i < nums.length; i++) {', color: 'text-white' },
  { text: '    const complement = target - nums[i];', color: 'text-green-400' },
  { text: '    if (map.has(complement)) {', color: 'text-yellow-400' },
  { text: '      return [map.get(complement), i];', color: 'text-green-400' },
  { text: '    }', color: 'text-yellow-400' },
  { text: '    map.set(nums[i], i);', color: 'text-white' },
  { text: '  }', color: 'text-white' },
  { text: '}', color: 'text-cyan-400' },
  { text: '', color: '' },
  { text: '// ✅ Accepted! Runtime: 72ms', color: 'text-green-400' },
]

const features = [
  { icon: '⚡', title: 'Real Interview Problems', desc: 'Curated DSA problems from top tech companies like Google, Amazon, Microsoft.' },
  { icon: '🏆', title: 'Compete & Rank', desc: 'Join weekly contests and climb the global leaderboard.' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Get instant hints, approach explanations and complexity analysis from AI.' },
]

const topics = [
  { icon: '📦', label: 'Arrays' },
  { icon: '🔗', label: 'Linked List' },
  { icon: '🌳', label: 'Trees' },
  { icon: '📊', label: 'Graphs' },
  { icon: '💡', label: 'Dynamic Programming' },
  { icon: '🔍', label: 'Binary Search' },
  { icon: '📚', label: 'Stacks & Queues' },
  { icon: '🧮', label: 'Math' },
]

export default function Home() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [typed, setTyped] = useState('')
  const fullText = 'Practice Coding, Crack Interviews'

  // Typewriter effect
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  // Code lines animation
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < codeLines.length) {
        setVisibleLines(prev => prev + 1)
        i++
      } else {
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-14 bg-[#0d1117]">
      {/* Hero Section */}
      <section className="min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-full mb-6">
              🚀 AI-Powered Coding Platform
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 min-h-[140px]">
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

          {/* Right: Code Editor Visual */}
          <div className="relative">
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-green-400/10 border border-green-400/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full z-10 animate-bounce">
              ✅ Accepted!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full z-10">
              🤖 AI Hint Available
            </div>

            {/* Editor window */}
            <div className="bg-[#161b22] border border-gray-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-3 text-xs text-gray-500 font-mono">solution.js — Two Sum</span>
                <span className="ml-auto text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded">JavaScript</span>
              </div>

              {/* Code */}
              <div className="p-5 font-mono text-sm leading-7 min-h-[280px]">
                {codeLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className={`${line.color} transition-all duration-300`}>
                    <span className="text-gray-600 select-none mr-4 text-xs">{i + 1}</span>
                    {line.text}
                  </div>
                ))}
                {visibleLines < codeLines.length && (
                  <span className="animate-pulse text-cyan-400">▋</span>
                )}
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border-t border-gray-800">
                <div className="flex gap-3">
                  <span className="text-xs text-gray-500">⏱ Runtime: <span className="text-green-400">72ms</span></span>
                  <span className="text-xs text-gray-500">💾 Memory: <span className="text-green-400">42.1MB</span></span>
                </div>
                <span className="text-xs text-green-400 font-semibold">Beats 94% 🎉</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why CodeHub?</h2>
          <p className="text-gray-400">Everything you need to crack your next coding interview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/5 transition group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/20 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-500/5 rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-3">Ready to crack your dream job? 🚀</h2>
            <p className="text-gray-400 mb-6">Join thousands of developers practicing DSA daily</p>
            <Link to="/signup"
              className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-400/25">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
