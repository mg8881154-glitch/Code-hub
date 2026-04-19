import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const links = [
    { to: '/', label: 'Home' },
    { to: '/problems', label: 'Problems' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: '📊 Analytics' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-black font-black text-sm shadow-lg shadow-cyan-400/30 group-hover:shadow-cyan-400/50 transition">
            {'</>'}
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className="text-white">Code</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition ${pathname === l.to ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link>
          <Link to="/signup" className="text-sm bg-cyan-400 text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-cyan-300 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
