import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await axios.post('http://localhost:5000/signup', form)
      navigate('/login')
    } catch {
      setError('Signup failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center text-black font-black text-lg mx-auto mb-3">C</div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join CodeHub and start solving</p>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-2 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'username', label: 'Username', type: 'text', ph: 'Kinetic' },
              { key: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', ph: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 mb-1.5 block">{f.label}</label>
                <input type={f.type} required placeholder={f.ph}
                  value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-cyan-400 text-black font-bold py-2.5 rounded-xl hover:bg-cyan-300 transition disabled:opacity-50 text-sm">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Have an account? <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
