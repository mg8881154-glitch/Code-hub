import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Code2, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { dark } = useTheme()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 transition-colors relative overflow-hidden ${
      dark ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <Code2 className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Welcome Back</h1>
          <p className={`text-xs mt-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in to continue your algorithmic mastery track
          </p>
        </div>

        {/* Card Container */}
        <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${
          dark
            ? 'bg-slate-900/80 border-slate-800/90 shadow-black/50'
            : 'bg-white/90 border-slate-200 shadow-slate-200/50'
        }`}>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs font-semibold mb-1.5 block ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition ${
                    dark
                      ? 'bg-slate-950/60 border-slate-700/80 text-white placeholder-slate-600 focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-semibold mb-1.5 block ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition ${
                    dark
                      ? 'bg-slate-950/60 border-slate-700/80 text-white placeholder-slate-600 focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 hover:shadow-cyan-500/40 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
                Create account free
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Encrypted credentials & secure JWT session</span>
          </span>
        </div>

      </div>
    </div>
  )
}
