import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Code2,
  Sparkles,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  Mic,
  X,
  Layers,
  Flame,
  Tag
} from 'lucide-react'
import api from '../api'
import { useTheme } from '../context/ThemeContext'

const diffStyle = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

const diffDot = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
}

const sourceStyle = {
  LeetCode: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  CSES: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  GFG: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Interview Pattern': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function Problems() {
  const { dark } = useTheme()
  const [problems, setProblems] = useState([])
  const [filter, setFilter] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [selectedSource, setSelectedSource] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/problems')
      .then(res => {
        setProblems(res.data)
      })
      .catch(err => {
        console.error('Fetch problems error:', err)
        setProblems([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Extract unique tags & sources
  const allTags = useMemo(() => {
    const tagsSet = new Set()
    problems.forEach(p => (p.tags || []).forEach(t => tagsSet.add(t)))
    return ['All', ...Array.from(tagsSet).slice(0, 10)]
  }, [problems])

  const allSources = ['All', 'LeetCode', 'CSES', 'Interview Pattern']

  const filtered = useMemo(() => {
    return problems
      .filter(p => filter === 'All' || p.difficulty === filter)
      .filter(p => selectedSource === 'All' || (p.source && p.source.toLowerCase() === selectedSource.toLowerCase()))
      .filter(p => selectedTag === 'All' || (p.tags && p.tags.includes(selectedTag)))
      .filter(p => {
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        )
      })
  }, [problems, filter, selectedSource, selectedTag, search])

  const counts = useMemo(() => ({
    all: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  }), [problems])

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Problem Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Problem Hub</span>
            </h1>
            <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Solve {problems.length} high-yield coding challenges with real-time test verification and AI guidance.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{counts.easy} Easy</span>
            </span>
            <span className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{counts.medium} Medium</span>
            </span>
            <span className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>{counts.hard} Hard</span>
            </span>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className={`p-4 rounded-3xl border mb-8 backdrop-blur-xl shadow-lg transition-all ${
          dark ? 'bg-slate-900/70 border-slate-800/80 shadow-black/20' : 'bg-white/90 border-slate-200/90 shadow-slate-200/50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by title, concepts, or algorithms..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all ${
                  dark
                    ? 'bg-[#0d1322] border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600'
                }`}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Tabs */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    filter === f
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-md shadow-cyan-500/25'
                      : dark
                      ? 'bg-[#0d1322] text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Source Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={selectedSource}
                onChange={e => setSelectedSource(e.target.value)}
                className={`w-full py-2.5 px-3 text-xs rounded-xl border font-semibold focus:outline-none transition-all ${
                  dark
                    ? 'bg-[#0d1322] border-slate-700/80 text-slate-300 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-700 focus:border-cyan-600'
                }`}
              >
                {allSources.map(s => (
                  <option key={s} value={s}>Source: {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags row */}
          {allTags.length > 1 && (
            <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t overflow-x-auto pb-1 ${
              dark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <span className="text-xs text-slate-400 mr-1 font-semibold whitespace-nowrap flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Topics:</span>
              </span>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`text-xs px-3 py-1 rounded-lg border whitespace-nowrap font-medium transition-all ${
                    selectedTag === t
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold'
                      : dark
                      ? 'bg-[#0d1322] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`border rounded-3xl p-6 animate-pulse ${
                  dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-slate-700/50 rounded w-16" />
                  <div className="h-5 bg-slate-700/50 rounded w-20" />
                </div>
                <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-800/50 rounded w-full mb-2" />
                <div className="h-4 bg-slate-800/50 rounded w-2/3 mb-5" />
                <div className="h-10 bg-slate-800/50 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Problems Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <div
                key={p._id}
                className={`border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
                  dark
                    ? 'bg-slate-900/70 border-slate-800/80 hover:border-cyan-500/40 hover:shadow-cyan-500/5'
                    : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-slate-200'
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${diffStyle[p.difficulty] || diffStyle.Medium}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${diffDot[p.difficulty] || 'bg-amber-400'}`} />
                      <span>{p.difficulty}</span>
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${sourceStyle[p.source] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                      {p.source || 'LeetCode'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-xs">#{i + 1}</span>
                    <span>{p.title}</span>
                  </h3>

                  {/* Description */}
                  <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {p.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags?.slice(0, 3).map(t => (
                      <span
                        key={t}
                        className={`text-[11px] px-2.5 py-0.5 rounded-md border font-medium ${
                          dark ? 'bg-[#0d1322] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                    {p.timeComplexity && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                        {p.timeComplexity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${
                  dark ? 'border-slate-800/80' : 'border-slate-100'
                }`}>
                  <Link
                    to={`/problems/${p._id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2.5 rounded-xl hover:shadow-md hover:shadow-cyan-500/25 active:scale-95 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Solve Problem</span>
                  </Link>
                  <Link
                    to="/interview"
                    state={{ problem: p }}
                    className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${
                      dark
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-white'
                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Mock AI</span>
                  </Link>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className={`col-span-full text-center py-20 rounded-3xl border ${
                dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Search className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                <h3 className="text-lg font-bold">No Matching Problems Found</h3>
                <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Try tweaking your search keywords, difficulty filter, or topic selections.
                </p>
                <button
                  onClick={() => { setSearch(''); setFilter('All'); setSelectedTag('All'); setSelectedSource('All'); }}
                  className="mt-4 px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-md shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

