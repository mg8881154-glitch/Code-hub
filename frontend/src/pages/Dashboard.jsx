import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Flame,
  Code2,
  Trophy,
  Zap,
  Sparkles,
  Clock,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  BarChart3,
  Layers,
  Crown,
  Check,
  XCircle,
  AlertCircle,
  Award,
  Mic
} from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const diffStyle = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

const statusColor = {
  Accepted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Wrong Answer': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Time Limit Exceeded': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Runtime Error': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { dark } = useTheme()

  const [daily, setDaily] = useState(null)
  const [dailyLoading, setDailyLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')
  const [stats, setStats] = useState({
    solved: 0,
    streak: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    bookmarks: 0,
    badges: [],
  })
  const [recentSubs, setRecentSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch daily challenge
    api.get('/daily-challenge')
      .then(r => setDaily(r.data))
      .catch(() => setDaily(null))
      .finally(() => setDailyLoading(false))

    // Fetch user stats & submissions
    if (token) {
      Promise.all([
        api.get('/user/stats'),
        api.get('/api/submissions/me')
      ])
        .then(([statsRes, subsRes]) => {
          setStats(statsRes.data)
          setRecentSubs(subsRes.data || [])
        })
        .catch(err => console.error('Dashboard data fetch error:', err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  // Countdown timer to midnight
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
    <div className={`pt-16 min-h-screen transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* User Profile Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl shadow-lg transition-all ${
          dark
            ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border-slate-800 shadow-black/20'
            : 'bg-white/90 border-slate-200/90 shadow-slate-200/50'
        }`}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/25">
              {user?.username?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black">{user?.username || 'Software Engineer'}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 flex items-center gap-1">
                  {user?.role === 'admin' ? <Crown className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-cyan-400" />}
                  <span>{user?.role === 'admin' ? 'Admin' : 'Pro Engineer'}</span>
                </span>
              </div>
              <p className={`text-xs mt-1.5 flex items-center gap-3 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>{user?.email}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{stats.streak} Days Active Streak</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/problems"
              className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Solve Problem</span>
            </Link>
            <Link
              to="/interview"
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                dark
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-white'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Mock AI Interview</span>
            </Link>
          </div>
        </div>

        {/* Stats 4-Card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Solved', value: stats.solved, sub: 'completed challenges', color: 'text-cyan-400', bar: 'bg-cyan-400', max: 75, icon: Zap },
            { label: 'Easy Problems', value: stats.easyCount, sub: 'foundations mastered', color: 'text-emerald-400', bar: 'bg-emerald-400', max: 35, icon: CheckCircle2 },
            { label: 'Medium Problems', value: stats.mediumCount, sub: 'interview standards', color: 'text-amber-400', bar: 'bg-amber-400', max: 30, icon: Layers },
            { label: 'Hard Problems', value: stats.hardCount, sub: 'advanced algorithms', color: 'text-rose-400', bar: 'bg-rose-400', max: 10, icon: Trophy },
          ].map(s => {
            const IconComp = s.icon
            return (
              <div
                key={s.label}
                className={`p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                  dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
                  <IconComp className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-3xl font-black ${s.color} mb-1 tracking-tight`}>{s.value}</div>
                <span className="text-[11px] text-slate-500 block mb-3 font-medium">{s.sub}</span>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full ${s.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, Math.max(5, (s.value / s.max) * 100))}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Middle Row: Daily Challenge & Badges Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Daily Challenge Feature Card */}
          <div className={`lg:col-span-7 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between backdrop-blur-xl ${
            dark
              ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Problem of the Day</span>
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Resets in: <strong className="text-cyan-400">{timeLeft}</strong></span>
                </span>
              </div>

              {dailyLoading ? (
                <div className="animate-pulse space-y-2 py-4">
                  <div className="h-6 bg-slate-700 rounded w-1/2" />
                  <div className="h-4 bg-slate-800 rounded w-full" />
                </div>
              ) : daily ? (
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-xl font-black">{daily.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${diffStyle[daily.difficulty] || diffStyle.Easy}`}>
                      {daily.difficulty}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-3 mb-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {daily.description}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm py-4">Daily challenge active in problem list.</p>
              )}
            </div>

            {daily && (
              <div className={`flex items-center gap-3 pt-4 border-t ${
                dark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <Link
                  to={`/problems/${daily._id}`}
                  className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Solve Today's Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/problems"
                  className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
                >
                  View all problems
                </Link>
              </div>
            )}
          </div>

          {/* Quick Badges & Achievements Widget */}
          <div className={`lg:col-span-5 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Unlocked Badges</span>
                </h3>
                <Link to="/badges" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                  <span>View All ({stats.badges?.length || 0})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {stats.badges?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {stats.badges.slice(0, 4).map(b => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all hover:scale-105 ${
                        dark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate">{b.name}</p>
                        <span className="text-[10px] text-slate-500 block truncate">{b.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No badges unlocked yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Solve your first problem to earn "First Blood"!</p>
                </div>
              )}
            </div>

            <div className={`pt-4 border-t flex justify-between items-center text-xs ${
              dark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
            }`}>
              <span className="flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>Saved Bookmarks: <strong className="text-cyan-400">{stats.bookmarks}</strong></span>
              </span>
              <Link to="/analytics" className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics Report</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className={`p-6 sm:p-7 rounded-3xl border ${
          dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Recent Submissions</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{recentSubs.length} recorded</span>
          </div>

          {recentSubs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="pb-3 font-semibold">Problem</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Language</th>
                    <th className="pb-3 font-semibold">Runtime</th>
                    <th className="pb-3 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {recentSubs.map((sub, i) => (
                    <tr key={sub._id || i} className={`transition-colors ${dark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 font-bold">
                        <Link to={`/problems/${sub.problemId?._id || sub.problemId}`} className="hover:text-cyan-400 transition">
                          {sub.problemId?.title || sub.problemTitle || 'DSA Problem'}
                        </Link>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${statusColor[sub.status] || statusColor.Accepted}`}>
                          {sub.status || 'Accepted'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono">{sub.language || 'JavaScript'}</td>
                      <td className="py-3 text-cyan-400 font-mono">{sub.runtime || '42ms'}</td>
                      <td className="py-3 text-slate-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500 text-xs">No recent submissions yet. Start solving problems!</p>
              <Link to="/problems" className="mt-3 inline-block px-5 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-md shadow-cyan-500/20 hover:opacity-95 transition">
                Go to Problems Hub
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

