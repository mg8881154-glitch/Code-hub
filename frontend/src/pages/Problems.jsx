import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const diffStyle = {
  Easy:   'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard:   'text-red-400 bg-red-400/10 border-red-400/20',
}

const sourceStyle = {
  LeetCode:   'text-orange-400 bg-orange-400/10',
  GFG:        'text-green-400 bg-green-400/10',
  HackerRank: 'text-emerald-400 bg-emerald-400/10',
}

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/problems')
      .then(r => r.json())
      .then(data => {
        console.log('Problems fetched:', data.length)
        setProblems(data)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setProblems([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = problems
    .filter(p => filter === 'All' || p.difficulty === filter)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Problems</h1>
          <p className="text-gray-400 text-sm">{problems.length} curated problems from LeetCode, GFG & HackerRank</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[#161b22] border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  filter === f
                    ? 'bg-cyan-400 text-black border-cyan-400'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-8">
          {['Easy', 'Medium', 'Hard'].map(d => (
            <div key={d} className={`text-xs font-semibold px-3 py-1 rounded-full border ${diffStyle[d]}`}>
              {problems.filter(p => p.difficulty === d).length} {d}
            </div>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-800 rounded w-full mb-2" />
                <div className="h-3 bg-gray-800 rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-800 rounded-full w-14" />
                  <div className="h-5 bg-gray-800 rounded-full w-14" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <div key={p._id}
                className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 flex flex-col hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/5 transition group">
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${diffStyle[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${sourceStyle[p.source] || 'text-gray-400 bg-gray-800'}`}>
                    {p.source}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-cyan-400 transition leading-snug">
                  #{i + 1} {p.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.tags?.slice(0, 3).map(t => (
                    <span key={t} className="text-xs bg-[#0d1117] text-gray-400 px-2 py-0.5 rounded-full border border-gray-800">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Solve button */}
                <Link to={`/problems/${p._id}`}
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-cyan-400 border border-cyan-400/30 px-4 py-2 rounded-xl hover:bg-cyan-400 hover:text-black transition">
                  Solve →
                </Link>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-16">No problems found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
