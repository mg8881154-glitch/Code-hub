import { useState, useEffect } from 'react'
import axios from 'axios'

const USER_ID = "kinetic_dev"

export default function Badges() {
  const [data, setData] = useState({ badges: [], allBadges: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${USER_ID}/badges`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  const earned = data.badges.map(b => b.id)

  return (
    <div className="pt-14 min-h-screen bg-[#0d1117]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            🏅 Badges & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Achievements</span>
          </h1>
          <p className="text-gray-400 text-sm">{data.badges.length} / {data.allBadges.length} badges earned</p>
        </div>

        {/* Progress bar */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-cyan-400 font-semibold">{data.badges.length}/{data.allBadges.length}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${data.allBadges.length ? (data.badges.length / data.allBadges.length) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Earned Badges */}
        {data.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              ✅ Earned <span className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full">{data.badges.length}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.badges.map(b => (
                <div key={b.id} className="bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-400/30 rounded-2xl p-5 text-center hover:scale-105 transition">
                  <div className="text-4xl mb-2">{b.icon}</div>
                  <p className="text-white font-bold text-sm">{b.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{b.description}</p>
                  <p className="text-cyan-400 text-xs mt-2">
                    {new Date(b.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            🔒 Locked <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">{data.allBadges.length - data.badges.length}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.allBadges.filter(b => !earned.includes(b.id)).map(b => (
              <div key={b.id} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 text-center opacity-50 hover:opacity-70 transition">
                <div className="text-4xl mb-2 grayscale">{b.icon}</div>
                <p className="text-gray-400 font-bold text-sm">{b.name}</p>
                <p className="text-gray-600 text-xs mt-1">{b.description}</p>
                <p className="text-gray-700 text-xs mt-2">🔒 Locked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
