import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Award, Trophy, Sparkles, Lock, CheckCircle2, ShieldCheck, Flame, Zap } from 'lucide-react'

export default function Badges() {
  const [data, setData] = useState({ badges: [], allBadges: [] })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { dark } = useTheme()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/user/badges')
      .then(r => setData(r.data))
      .catch(err => console.error('Badges fetch error:', err))
      .finally(() => setLoading(false))
  }, [token])

  const earned = data.badges.map(b => b.id)
  const totalCount = data.allBadges?.length || 13
  const earnedCount = data.badges?.length || 0
  const progressPct = totalCount ? Math.round((earnedCount / totalCount) * 100) : 0

  return (
    <div className={`pt-20 min-h-screen transition-colors ${dark ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Milestones & Recognition</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Badges & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500">Achievements</span>
            </h1>
            <p className={`text-sm mt-1 max-w-xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Level up your problem-solving craft and collect rare achievement trophies as you conquer data structure challenges.
            </p>
          </div>

          <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
            dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Unlocked</div>
              <div className="text-lg font-black">{earnedCount} <span className="text-xs text-slate-500 font-normal">/ {totalCount}</span></div>
            </div>
          </div>
        </div>

        {/* Progress bar card */}
        <div className={`p-6 sm:p-7 rounded-3xl border mb-10 relative overflow-hidden ${
          dark ? 'bg-gradient-to-br from-slate-900/90 to-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Overall Milestone Mastery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{earnedCount} of {totalCount} Badges Acquired</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {progressPct}%
                </span>
              </div>
            </div>

            <div className={`h-3.5 rounded-full overflow-hidden p-0.5 ${dark ? 'bg-slate-800/80' : 'bg-slate-100'}`}>
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`p-6 rounded-2xl border animate-pulse h-48 ${
                dark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`} />
            ))}
          </div>
        )}

        {/* Earned Badges Section */}
        {!loading && earnedCount > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Earned Badges</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  {earnedCount}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.badges.map(b => (
                <div
                  key={b.id}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    dark
                      ? 'bg-gradient-to-b from-cyan-500/10 via-slate-900/60 to-slate-900/90 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/10'
                      : 'bg-gradient-to-b from-cyan-50/80 to-white border-cyan-200 hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {b.icon || '🏆'}
                  </div>
                  <h3 className="font-bold text-sm text-center tracking-tight mb-1">{b.name}</h3>
                  <p className={`text-xs text-center leading-relaxed line-clamp-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {b.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-center gap-1.5 text-[11px] font-medium text-cyan-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Unlocked {new Date(b.earnedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges Section */}
        {!loading && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Lock className="w-4 h-4" />
                <span>Available to Unlock</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  dark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {totalCount - earnedCount}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(data.allBadges || [])
                .filter(b => !earned.includes(b.id))
                .map(b => (
                  <div
                    key={b.id}
                    className={`relative p-6 rounded-2xl border transition-all duration-200 ${
                      dark
                        ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white/60 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-3xl mb-4 grayscale opacity-40">
                      {b.icon}
                    </div>
                    <h3 className={`font-bold text-sm text-center tracking-tight mb-1 ${dark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {b.name}
                    </h3>
                    <p className={`text-xs text-center leading-relaxed line-clamp-2 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {b.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <Lock className="w-3 h-3" />
                      <span>Locked Milestone</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
