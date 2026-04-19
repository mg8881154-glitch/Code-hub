import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await axios.post('http://localhost:5000/login', form)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-black font-black text-sm mx-auto mb-3 shadow-lg shadow-cyan-400/30">
            {'</>'}
          </div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-white">Code</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Login to continue your streak</p>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-2 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-cyan-400 text-black font-bold py-2.5 rounded-xl hover:bg-cyan-300 transition disabled:opacity-50 text-sm">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            No account? <Link to="/signup" className="text-cyan-400 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
