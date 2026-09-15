import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Sparkles,
  Code2,
  BrainCircuit,
  Trophy,
  Zap,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Bot,
  BarChart3,
  Layers,
  ShieldCheck,
  Cpu,
  Flame,
  Check
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const features = [
  {
    icon: Code2,
    color: 'from-cyan-500 to-blue-600',
    title: 'High-Yield DSA Problems',
    desc: 'Curated LeetCode, CSES & FAANG interview patterns from Google, Amazon, Meta, and Microsoft.',
  },
  {
    icon: BrainCircuit,
    color: 'from-purple-500 to-indigo-600',
    title: 'Adaptive AI Mentor',
    desc: 'Get step-by-step hints, time/space complexity audits, and edge-case feedback in real time.',
  },
  {
    icon: Trophy,
    color: 'from-amber-400 to-orange-500',
    title: 'Telemetry & Achievements',
    desc: 'Interactive skill mastery radars, streak analytics, badges, and competitive leaderboard ranks.',
  },
]

const topics = [
  { label: 'Arrays', count: '32' },
  { label: 'Two Pointers', count: '18' },
  { label: 'Sliding Window', count: '14' },
  { label: 'Binary Search', count: '20' },
  { label: 'Dynamic Programming', count: '36' },
  { label: 'Trees & BST', count: '26' },
  { label: 'Graphs & BFS/DFS', count: '24' },
  { label: 'Stack & Queue', count: '16' },
]

const companies = [
  { name: 'Google', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { name: 'Amazon', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Microsoft', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Meta', badge: 'bg-blue-600/10 text-blue-400 border-blue-600/20' },
  { name: 'Apple', badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
  { name: 'Netflix', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
]

export default function Home() {
  const { dark } = useTheme()
  const [typed, setTyped] = useState('')
  const fullText = 'Practice Coding. Crack Tech Interviews.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>

      {/* ── Background Glow Elements ── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-36 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Hero Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Next-Gen AI DSA &amp; Interview Accelerator</span>
              </div>

              {/* Bold Heading with Typewriter */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                  {typed}
                </span>
                <span className="animate-pulse text-cyan-400 ml-1">|</span>
              </h1>

              {/* Paragraph Description */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                dark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Master Data Structures and Algorithms with intelligent AI code coaching, real-time telemetry, mock technical interviews, and curated problem sets from top tech companies.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/problems"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Start Solving Problems</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/interview"
                  className={`px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all flex items-center gap-2 ${
                    dark
                      ? 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-purple-500/60 hover:text-purple-300 hover:bg-slate-850 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-purple-400 hover:text-purple-600 shadow-sm'
                  }`}
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Mock AI Interview</span>
                </Link>
              </div>

              {/* POPULAR DSA TRACKS */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    dark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    POPULAR DSA TRACKS
                  </span>
                  <span className="h-px flex-1 bg-slate-800/80 max-w-[120px]" />
                </div>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  {topics.map(t => (
                    <Link
                      key={t.label}
                      to="/problems"
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        dark
                          ? 'bg-slate-900/80 border-slate-800/90 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-800/90'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-600 shadow-sm'
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Hero Column: User's Featured Banner Graphic */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0 group">
              {/* Glowing ambient background */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/30 via-blue-500/25 to-purple-600/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Image Container Card */}
              <div className={`relative rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${
                dark ? 'border-slate-700/80 bg-slate-900/90 shadow-cyan-950/40' : 'border-slate-200 bg-white shadow-xl'
              }`}>
                <img
                  src="/hero-banner.png"
                  alt="CodeHub - Sharpen Your Skills One Problem at a Time"
                  className="w-full h-auto object-cover rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── Hiring Companies Strip ── */}
        <section className={`border-y py-6 transition-colors ${
          dark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className={`text-center text-[11px] uppercase font-bold tracking-widest mb-4 ${
              dark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Interview Questions Curated from Top Engineering Teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
              {companies.map(c => (
                <span
                  key={c.name}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border ${c.badge} transition-transform hover:scale-105`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Highlights Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Zap className="w-3 h-3" />
              <span>Engineered for Interview Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Everything You Need to Master DSA &amp; Land Offers
            </h2>
            <p className={`text-sm sm:text-base ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Structured learning pathways designed to develop intuition, clean code habits, and fast problem-solving velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(f => {
              const IconComp = f.icon
              return (
                <div
                  key={f.title}
                  className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    dark
                      ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:shadow-cyan-500/5'
                      : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-lg shadow-cyan-500/10`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Call To Action Banner ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative rounded-3xl border p-8 sm:p-12 text-center overflow-hidden bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30 shadow-2xl backdrop-blur-xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-cyan-500/25">
                <Code2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mb-4">
                Ready to Level Up Your Coding Career?
              </h2>
              <p className={`text-sm sm:text-base mb-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                Join thousands of software engineers solving interview problems, analyzing runtime complexities, and mastering algorithms daily.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/problems"
                  className={`px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all ${
                    dark
                      ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Browse 75+ Problems
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
