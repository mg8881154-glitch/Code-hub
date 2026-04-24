import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/problems', label: 'Problems' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: '📊 Analytics' },
    { to: '/bookmarks', label: '🔖 Bookmarks' },
    { to: '/badges', label: '🏅 Badges' },
    { to: '/interview', label: '🎙 Interview' },
  ]

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur border-b transition-colors ${
      dark ? 'bg-[#0d1117]/90 border-gray-800' : 'bg-white/90 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-black font-black text-xs shadow-lg shadow-cyan-400/30 group-hover:shadow-cyan-400/50 transition">
            {'</>'}
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className={dark ? 'text-white' : 'text-gray-900'}>Code</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5 overflow-x-auto">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition whitespace-nowrap ${
                pathname === l.to
                  ? 'text-cyan-500'
                  : dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side: Theme toggle + Auth */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 🌙 / ☀️ Toggle */}
          <button onClick={toggle}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border ${
              dark
                ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700'
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
            }`}
            title={dark ? 'Switch to Light mode' : 'Switch to Dark mode'}>
            {dark ? (
              // Sun icon
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM3 12a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm15.364-6.364a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.343 17.657a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM18.364 18.364a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM5.636 5.636a1 1 0 011.414 0l.707.707A1 1 0 116.343 7.757l-.707-.707a1 1 0 010-1.414zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"/>
              </svg>
            ) : (
              // Moon icon
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-black text-xs">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className={`text-xs font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{user.username}</p>
                  <p className={`text-xs ${user.role === 'admin' ? 'text-yellow-400' : dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </p>
                </div>
              </div>
              <button onClick={handleLogout}
                className={`text-xs border px-3 py-1.5 rounded-lg transition ${
                  dark ? 'text-gray-400 border-gray-700 hover:border-red-400/50 hover:text-red-400' : 'text-gray-500 border-gray-300 hover:border-red-400 hover:text-red-500'
                }`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium transition px-3 py-1.5 rounded-lg ${
                dark
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}>Login</Link>
              <Link to="/signup" className="text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-4 py-1.5 rounded-lg hover:opacity-90 transition shadow-lg shadow-cyan-400/20">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
