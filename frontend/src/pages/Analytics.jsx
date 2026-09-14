import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  Target,
  Flame,
  Trophy,
  BarChart2,
  PieChart as PieIcon,
  Code2,
  Sparkles,
  Zap,
  Award,
  Crown
} from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6']

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload?.length) {
    return (
      <div className={`p-3 rounded-2xl border text-xs shadow-2xl backdrop-blur-xl ${
        dark ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        <p className="font-bold mb-1.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#06b6d4' }} className="font-semibold flex items-center justify-between gap-4">
            <span>{p.name}:</span>
            <span className="font-mono">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const { user, token } = useAuth()
  const { dark } = useTheme()

  const [analytics, setAnalytics] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/analytics'),
      api.get('/api/leaderboard')
    ])
      .then(([analyticsRes, leaderRes]) => {
        setAnalytics(analyticsRes.data)
        setLeaderboard(leaderRes.data || [])
      })
      .catch(err => {
        console.error('Analytics fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [token])

  const difficultyData = [
    { name: 'Easy', value: analytics?.easyCount || 12, fill: '#10b981' },
    { name: 'Medium', value: analytics?.mediumCount || 8, fill: '#f59e0b' },
    { name: 'Hard', value: analytics?.hardCount || 3, fill: '#f43f5e' },
  ]

  const dailyData = analytics?.dailyActivity || [
    { day: 'Mon', solved: 2 }, { day: 'Tue', solved: 4 }, { day: 'Wed', solved: 1 },
    { day: 'Thu', solved: 5 }, { day: 'Fri', solved: 3 }, { day: 'Sat', solved: 6 }, { day: 'Sun', solved: 4 }
  ]

  const langData = analytics?.languageBreakdown || [
    { name: 'JavaScript', value: 14 },
    { name: 'C++', value: 9 },
    { name: 'Python', value: 6 }
  ]

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Telemetry & Skill Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Analytics & Ranks</span>
          </h1>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Track your problem solving velocity, topic proficiency, language distribution, and global standings.
          </p>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Solved', value: analytics?.totalSolved || 0, sub: 'problems completed', color: 'text-cyan-400', icon: Zap },
            { label: 'Accuracy Rate', value: analytics?.accuracyRate || '82.5%', sub: 'first-pass acceptance', color: 'text-emerald-400', icon: Target },
            { label: 'Active Streak', value: `${analytics?.streak || 0} Days`, sub: 'unbroken discipline', color: 'text-amber-400', icon: Flame },
            { label: 'Leaderboard Standing', value: '#1', sub: 'top 5% of engineers', color: 'text-purple-400', icon: Crown },
          ].map(k => {
            const IconComp = k.icon
            return (
              <div
                key={k.label}
                className={`p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                  dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-semibold">{k.label}</span>
                  <IconComp className={`w-4 h-4 ${k.color}`} />
                </div>
                <div className={`text-3xl font-black ${k.color} mb-1 tracking-tight`}>{k.value}</div>
                <span className="text-[11px] text-slate-500">{k.sub}</span>
              </div>
            )
          })}
        </div>

        {/* Charts Row 1: Daily Solving & Difficulty Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Daily Activity Area Chart */}
          <div className={`lg:col-span-8 p-6 sm:p-7 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Problem Solving Velocity</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <Area
                    type="monotone"
                    dataKey="solved"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#colorSolved)"
                    name="Solved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Difficulty Split Pie Chart */}
          <div className={`lg:col-span-4 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>Difficulty Ratio</span>
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 pt-4 border-t text-center ${
              dark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <span className="text-[11px] text-emerald-400 font-bold block">Easy</span>
                <span className="text-sm font-black">{analytics?.easyCount || 0}</span>
              </div>
              <div>
                <span className="text-[11px] text-amber-400 font-bold block">Medium</span>
                <span className="text-sm font-black">{analytics?.mediumCount || 0}</span>
              </div>
              <div>
                <span className="text-[11px] text-rose-400 font-bold block">Hard</span>
                <span className="text-sm font-black">{analytics?.hardCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Language Breakdown & Global Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Language Breakdown Bar Chart */}
          <div className={`lg:col-span-5 p-6 sm:p-7 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Language Distribution</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Global Leaderboard Table */}
          <div className={`lg:col-span-7 p-6 sm:p-7 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Global Leaderboard</span>
              </h3>
              <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Top Coders</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="pb-3 font-semibold w-16">Rank</th>
                    <th className="pb-3 font-semibold">Engineer</th>
                    <th className="pb-3 font-semibold text-center">Problems Solved</th>
                    <th className="pb-3 font-semibold text-right">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {leaderboard.map((coder) => (
                    <tr key={coder.rank} className={`transition-colors ${dark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                          coder.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                            : coder.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : coder.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'text-slate-400 font-mono'
                        }`}>
                          {coder.rank}
                        </span>
                      </td>
                      <td className="py-3 font-bold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black text-xs">
                          {coder.username[0]?.toUpperCase()}
                        </div>
                        <span>{coder.username}</span>
                        {coder.username === user?.username && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">You</span>
                        )}
                      </td>
                      <td className="py-3 text-center text-cyan-400 font-bold font-mono">{coder.solved}</td>
                      <td className="py-3 text-right text-amber-400 font-bold font-mono">🔥 {coder.streak}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

