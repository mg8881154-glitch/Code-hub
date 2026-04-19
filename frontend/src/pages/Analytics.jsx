import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// ── Mock Data ──
const dailyActivity = [
  { day: 'Apr 13', solved: 2 }, { day: 'Apr 14', solved: 5 },
  { day: 'Apr 15', solved: 1 }, { day: 'Apr 16', solved: 4 },
  { day: 'Apr 17', solved: 3 }, { day: 'Apr 18', solved: 7 },
  { day: 'Apr 19', solved: 2 }, { day: 'Apr 20', solved: 6 },
  { day: 'Apr 21', solved: 4 }, { day: 'Apr 22', solved: 8 },
  { day: 'Apr 23', solved: 3 }, { day: 'Apr 24', solved: 5 },
  { day: 'Apr 25', solved: 9 }, { day: 'Apr 26', solved: 2 },
]

const difficultyData = [
  { name: 'Easy', solved: 120, total: 400, fill: '#4ade80' },
  { name: 'Medium', solved: 98, total: 600, fill: '#facc15' },
  { name: 'Hard', solved: 27, total: 200, fill: '#f87171' },
]

const topicData = [
  { topic: 'Arrays', solved: 45 },
  { topic: 'Trees', solved: 32 },
  { topic: 'DP', solved: 28 },
  { topic: 'Graphs', solved: 22 },
  { topic: 'Strings', solved: 38 },
  { topic: 'Linked List', solved: 18 },
  { topic: 'Stack', solved: 15 },
  { topic: 'Math', solved: 12 },
]

const accuracyTrend = [
  { month: 'Nov', accuracy: 62 }, { month: 'Dec', accuracy: 68 },
  { month: 'Jan', accuracy: 71 }, { month: 'Feb', accuracy: 74 },
  { month: 'Mar', accuracy: 76 }, { month: 'Apr', accuracy: 78.4 },
]

const submissionPie = [
  { name: 'Accepted', value: 245, color: '#22d3ee' },
  { name: 'Wrong Answer', value: 48, color: '#f87171' },
  { name: 'TLE', value: 22, color: '#facc15' },
  { name: 'Runtime Error', value: 12, color: '#a78bfa' },
]

const langPie = [
  { name: 'C++', value: 120, color: '#22d3ee' },
  { name: 'Python', value: 75, color: '#4ade80' },
  { name: 'Java', value: 50, color: '#facc15' },
]

const skillRadar = [
  { skill: 'Algorithms', score: 65 },
  { skill: 'Data Structures', score: 62 },
  { skill: 'DP', score: 45 },
  { skill: 'System Design', score: 40 },
  { skill: 'Math', score: 55 },
  { skill: 'Graphs', score: 50 },
]

const leaderboard = [
  { name: 'Kinetic Dev', solved: 245, rank: 1 },
  { name: 'AlgoMaster', solved: 312, rank: 2 },
  { name: 'CodeNinja', solved: 289, rank: 3 },
  { name: 'ByteWizard', solved: 267, rank: 4 },
  { name: 'DevRocket', solved: 198, rank: 5 },
]

const heatmapData = (() => {
  const data = []
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeks = ['W1', 'W2', 'W3', 'W4']
  weeks.forEach(w => days.forEach(d => {
    data.push({ week: w, day: d, count: Math.floor(Math.random() * 8) })
  }))
  return data
})()

const heatColor = (count) => {
  if (count === 0) return 'bg-gray-800'
  if (count <= 2) return 'bg-cyan-900'
  if (count <= 4) return 'bg-cyan-700'
  if (count <= 6) return 'bg-cyan-500'
  return 'bg-cyan-400'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1a1d2e] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  return (
    <div className="pt-14 min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            📊 Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm">Your complete coding performance overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Solved', value: '245', sub: '/ 1200 problems', color: 'text-cyan-400', icon: '✅' },
            { label: 'Accuracy Rate', value: '78.4%', sub: '+2.1% this month', color: 'text-green-400', icon: '🎯' },
            { label: 'Current Streak', value: '15 days', sub: 'Next milestone: 20', color: 'text-yellow-400', icon: '🔥' },
            { label: 'Global Rank', value: '#1,240', sub: 'Top 5%', color: 'text-purple-400', icon: '🏆' },
          ].map(k => (
            <div key={k.label} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs">{k.label}</p>
                <span className="text-xl">{k.icon}</span>
              </div>
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-gray-600 text-xs mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Row 1: Daily Activity + Difficulty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Daily Activity Line Chart */}
          <div className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">📈 Daily Solving Activity</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyActivity}>
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="solved" stroke="#22d3ee" fill="url(#colorSolved)" strokeWidth={2} name="Problems Solved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Difficulty Pie */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">🎯 Difficulty Split</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="solved" paddingAngle={3}>
                  {difficultyData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {difficultyData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs text-gray-400">{d.name}: <span className="text-white font-semibold">{d.solved}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Topic Bar + Accuracy Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Topic Bar Chart */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">📦 Topic-wise Solved</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis dataKey="topic" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" fill="#22d3ee" radius={[0, 6, 6, 0]} name="Solved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy Trend */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">📉 Accuracy Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[55, 85]} tick={{ fill: '#6b7280', fontSize: 11 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="accuracy" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: '#a78bfa', r: 4 }} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Skill Radar + Submission Pie + Language Pie */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Skill Radar */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">🕸 Skill Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Submission Result Pie */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">📋 Submission Results</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={submissionPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={2}>
                  {submissionPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {submissionPie.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-400 truncate">{d.name}: <span className="text-white">{d.value}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Pie */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">💻 Language Usage</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={langPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {langPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {langPie.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-gray-400">{d.name}: <span className="text-white font-semibold">{d.value}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Heatmap + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">🗓 Activity Heatmap</h2>
            <div className="flex gap-1">
              {['W1', 'W2', 'W3', 'W4'].map(w => (
                <div key={w} className="flex flex-col gap-1 flex-1">
                  <p className="text-gray-600 text-xs text-center mb-1">{w}</p>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => {
                    const cell = heatmapData.find(h => h.week === w && h.day === d)
                    return (
                      <div key={d} title={`${d} ${w}: ${cell?.count || 0} problems`}
                        className={`w-full aspect-square rounded-sm ${heatColor(cell?.count || 0)} cursor-pointer hover:opacity-80 transition`} />
                    )
                  })}
                </div>
              ))}
              <div className="flex flex-col justify-end gap-1 ml-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <p key={d} className="text-gray-600 text-xs h-4 flex items-center">{d}</p>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-gray-500 text-xs">Less</span>
              {['bg-gray-800', 'bg-cyan-900', 'bg-cyan-700', 'bg-cyan-500', 'bg-cyan-400'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-gray-500 text-xs">More</span>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">🏆 Top Solvers</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leaderboard}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" name="Problems Solved" radius={[6, 6, 0, 0]}>
                  {leaderboard.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#22d3ee' : i === 1 ? '#a78bfa' : i === 2 ? '#4ade80' : '#374151'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {leaderboard.slice(0, 3).map((u, i) => (
                <div key={u.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <span className={`text-sm font-medium ${u.name === 'Kinetic Dev' ? 'text-cyan-400' : 'text-gray-300'}`}>{u.name}</span>
                  </div>
                  <span className="text-sm text-gray-400 font-mono">{u.solved} solved</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
