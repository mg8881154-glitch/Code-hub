import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const submissions = [
  { title: 'Two Sum', lang: 'C++', status: 'Accepted', time: '12ms', mem: '8.2MB', when: '2 hours ago', ok: true },
  { title: 'LRU Cache', lang: 'Python', status: 'Time Limit Exceeded', time: '-', mem: '-', when: 'Yesterday', ok: false },
  { title: 'Merge K Sorted Lists', lang: 'Java', status: 'Accepted', time: '82ms', mem: '12.4MB', when: '2 days ago', ok: true },
  { title: 'Valid Parentheses', lang: 'C++', status: 'Accepted', time: '4ms', mem: '6.1MB', when: '3 days ago', ok: true },
]

const stats = [
  { label: 'Total Solved', value: 245, sub: 'out of 1200', color: 'text-cyan-400' },
  { label: 'Easy', value: 120, sub: 'solved', color: 'text-green-400' },
  { label: 'Medium', value: 98, sub: 'solved', color: 'text-yellow-400' },
  { label: 'Hard', value: 27, sub: 'solved', color: 'text-red-400' },
]

const skills = [
  { label: 'Algorithms', pct: 65, color: 'bg-cyan-400' },
  { label: 'Data Structures', pct: 62, color: 'bg-green-400' },
  { label: 'System Design', pct: 40, color: 'bg-purple-400' },
  { label: 'Dynamic Programming', pct: 35, color: 'bg-yellow-400' },
]

const diffStyle = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [daily, setDaily] = useState(null)
  const [dailyLoading, setDailyLoading] = useState(true)
  const [solved, setSolved] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  // Fetch daily challenge
  useEffect(() => {
    axios.get('http://localhost:5000/daily-challenge')
      .then(r => setDaily(r.data))
      .catch(() => setDaily(null))
      .finally(() => setDailyLoading(false))
  }, [])

  // Countdown to midnight
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="pt-14 min-h-screen bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-cyan-400/30">K</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Kinetic Dev</h1>
            <p className="text-gray-400 text-sm">Rank: #1,240 · Streak: 🔥 15 days</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <p className="text-gray-400 text-xs mb-2">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-600 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Submissions */}
          <div className="md:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">Recent Submissions</h2>
            <div className="space-y-3">
              {submissions.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800/60 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${s.ok ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {s.ok ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.title}</p>
                      <p className="text-gray-500 text-xs">{s.lang} · {s.time} · {s.mem}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${s.ok ? 'text-green-400' : 'text-red-400'}`}>{s.status}</p>
                    <p className="text-gray-600 text-xs">{s.when}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            {/* Skill Breakdown */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-5">Skill Breakdown</h2>
              <div className="space-y-4">
                {skills.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="text-white font-semibold">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Daily Challenge</p>
                  <p className="text-xs text-gray-600 mt-0.5">Resets in: <span className="text-cyan-400 font-mono">{timeLeft}</span></p>
                </div>
                <span className="text-2xl">🎯</span>
              </div>

              {dailyLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              ) : daily ? (
                <>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${diffStyle[daily.difficulty]}`}>
                        {daily.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{daily.source}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm mt-2">{daily.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{daily.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {daily.tags?.slice(0, 3).map(t => (
                      <span key={t} className="text-xs bg-[#0d1117] text-gray-500 px-2 py-0.5 rounded-full border border-gray-800">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-3 bg-cyan-400/5 border border-cyan-400/20 rounded-xl px-3 py-2">
                    <span className="text-cyan-400 text-sm">⏱</span>
                    <div>
                      <p className="text-xs text-gray-400">Time: <span className="text-cyan-400 font-mono">{daily.timeComplexity}</span></p>
                      <p className="text-xs text-gray-400">Space: <span className="text-purple-400 font-mono">{daily.spaceComplexity}</span></p>
                    </div>
                  </div>

                  {solved ? (
                    <div className="w-full bg-green-400/10 border border-green-400/30 text-green-400 font-semibold py-2 rounded-xl text-sm text-center">
                      ✅ Completed Today!
                    </div>
                  ) : (
                    <button
                      onClick={() => { navigate(`/problems/${daily._id}`); setSolved(true) }}
                      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow-lg shadow-cyan-400/20">
                      Solve Now →
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">Could not load challenge. Make sure backend is running.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
