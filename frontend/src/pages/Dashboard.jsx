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

export default function Dashboard() {
  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-black text-xl">K</div>
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

          {/* Skill Breakdown */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">Skill Breakdown</h2>
            <div className="space-y-5">
              {skills.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">{s.label}</span>
                    <span className="text-white font-semibold">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Daily Challenge</p>
              <p className="text-cyan-400 font-bold text-sm">Maximal Square</p>
              <p className="text-gray-500 text-xs mt-1 mb-3">Earn 10 coins</p>
              <button className="w-full bg-cyan-400 text-black text-xs font-bold py-2 rounded-lg hover:bg-cyan-300 transition">
                Solve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
