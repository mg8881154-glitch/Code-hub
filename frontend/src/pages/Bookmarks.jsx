import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Bookmark, Code2, Trash2, ArrowRight, Zap, FolderCheck, Clock, ExternalLink } from 'lucide-react'

const diffStyle = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { dark } = useTheme()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/user/bookmarks')
      .then(r => setBookmarks(r.data))
      .catch(err => console.error('Bookmarks fetch error:', err))
      .finally(() => setLoading(false))
  }, [token])

  const removeBookmark = async (id) => {
    try {
      await api.post(`/user/bookmark/${id}`)
      setBookmarks(prev => prev.filter(b => b._id !== id))
    } catch (err) {
      console.error('Remove bookmark error:', err)
    }
  }

  return (
    <div className={`pt-20 min-h-screen transition-colors ${dark ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Bookmarked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Challenges</span>
            </h1>
            <p className={`text-sm mt-1 max-w-xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your curated revision deck for high-frequency algorithms, tricky edge cases, and upcoming interview prep.
            </p>
          </div>

          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 ${
            dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className="text-xs text-slate-400 font-medium">Saved Items:</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{bookmarks.length} Problems</span>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`p-5 rounded-2xl border animate-pulse h-28 ${
                dark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookmarks.length === 0 && (
          <div className={`text-center py-20 px-6 rounded-3xl border ${
            dark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <FolderCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Saved Bookmarks Yet</h3>
            <p className={`text-xs max-w-md mx-auto mb-6 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Whenever you're reviewing a challenging problem in the repository, click the bookmark icon to pin it here for quick revision.
            </p>
            <Link
              to="/problems"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Browse Problem Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Bookmarks List */}
        {!loading && bookmarks.length > 0 && (
          <div className="space-y-3.5">
            {bookmarks.map(p => (
              <div
                key={p._id}
                className={`group p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-200 hover:-translate-y-0.5 ${
                  dark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90'
                    : 'bg-white border-slate-200 hover:border-cyan-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${diffStyle[p.difficulty] || diffStyle.Medium}`}>
                      {p.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/50">
                      {p.source || 'Standard'}
                    </span>
                    {p.timeComplexity && (
                      <span className="text-xs text-purple-400 font-mono px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                        {p.timeComplexity}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold transition group-hover:text-cyan-400">
                    <Link to={`/problems/${p._id}`} className="hover:underline flex items-center gap-1.5">
                      <span>{p.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </h3>
                  <p className={`text-xs line-clamp-1 mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <Link
                    to={`/problems/${p._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:opacity-95 shadow-md shadow-cyan-500/20 transition"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Solve Challenge</span>
                  </Link>
                  <button
                    onClick={() => removeBookmark(p._id)}
                    className={`p-2 rounded-xl transition ${
                      dark
                        ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20'
                        : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200'
                    }`}
                    title="Remove from saved bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
