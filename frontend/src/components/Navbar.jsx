import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const links = [
    { to: '/', label: 'Home' },
    { to: '/problems', label: 'Problems' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-cyan-400 rounded flex items-center justify-center text-black font-black text-sm">C</div>
          <span className="text-white font-bold text-lg">CodeHub</span>
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
