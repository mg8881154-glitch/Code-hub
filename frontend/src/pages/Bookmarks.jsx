import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const USER_ID = "kinetic_dev"

const diffStyle = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${USER_ID}/bookmarks`)
      .then(r => setBookmarks(r.data))
      .finally(() => setLoading(false))
  }, [])

  const removeBookmark = async (id) => {
    await axios.post(`http://localhost:5000/user/${USER_ID}/bookmark/${id}`)
    setBookmarks(prev => prev.filter(b => b._id !== id))
  }

  return (
    <div className="pt-14 min-h-screen bg-[#0d1117]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            🔖 Bookmarked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Problems</span>
          </h1>
          <p className="text-gray-400 text-sm">{bookmarks.length} problems saved</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        )}

        {!loading && bookmarks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔖</p>
            <p className="text-gray-400 text-lg">No bookmarks yet</p>
            <p className="text-gray-600 text-sm mt-2">Click the bookmark icon on any problem to save it here</p>
            <Link to="/problems" className="inline-block mt-6 bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-cyan-300 transition text-sm">
              Browse Problems →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {bookmarks.map(p => (
            <div key={p._id} className="bg-[#161b22] border border-gray-800 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-cyan-400/30 transition group">
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${diffStyle[p.difficulty]}`}>
                  {p.difficulty}
                </span>
                <div>
                  <p className="text-white font-medium text-sm group-hover:text-cyan-400 transition">{p.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/problems/${p._id}`}
                  className="text-xs text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-lg hover:bg-cyan-400 hover:text-black transition">
                  Solve →
                </Link>
                <button onClick={() => removeBookmark(p._id)}
                  className="text-gray-600 hover:text-red-400 transition text-lg">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
