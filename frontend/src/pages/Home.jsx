import { Link } from 'react-router-dom'

const stats = [
  { label: 'Problems', value: '1,200+' },
  { label: 'Users', value: '50K+' },
  { label: 'Companies', value: '200+' },
]

const features = [
  { icon: '⚡', title: 'Real Interview Problems', desc: 'Curated problems from top tech companies like Google, Amazon, Microsoft.' },
  { icon: '🏆', title: 'Compete & Rank', desc: 'Join weekly contests and climb the global leaderboard.' },
  { icon: '📊', title: 'Track Progress', desc: 'Detailed stats on your solving history, streaks, and skill breakdown.' },
]

export default function Home() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0d1f2d] to-[#0d1117]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full mb-6">
            🚀 The #1 Coding Practice Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Practice Coding,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Crack Interviews
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Solve 1200+ problems, compete in contests, and land your dream job at top tech companies.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/problems"
              className="bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-300 transition text-sm shadow-lg shadow-cyan-400/20">
              Start Solving →
            </Link>
            <Link to="/dashboard"
              className="border border-gray-700 text-white font-medium px-8 py-3 rounded-xl hover:border-gray-500 transition text-sm">
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-16">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why CodeHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 hover:border-cyan-400/40 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
