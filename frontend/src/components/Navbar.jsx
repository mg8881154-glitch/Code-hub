import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Code2,
  Home,
  LayoutDashboard,
  BarChart2,
  Bookmark,
  Award,
  Mic,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  Crown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/badges', label: 'Badges', icon: Award },
    { to: '/interview', label: 'Mock AI', icon: Mic, badge: 'AI' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
      dark
        ? 'bg-[#090d16]/85 border-slate-800/80 shadow-lg shadow-black/20'
        : 'bg-white/85 border-slate-200/90 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Code2 className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="font-black text-xl tracking-tight flex items-center gap-1">
            <span className={dark ? 'text-white' : 'text-slate-900'}>Code</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Hub</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-1 hidden sm:inline-block">
              PRO
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border ${
          dark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100/80 border-slate-200/80'
        }`}>
          {links.map(l => {
            const isActive = pathname === l.to
            const IconComponent = l.icon
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : dark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{l.label}</span>
                {l.badge && (
                  <span className={`text-[9px] font-bold px-1 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {l.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Action Tools: Theme & Auth Profile */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Theme Switcher Button */}
          <button
            onClick={toggle}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
              dark
                ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-400/40'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-all ${
                  dark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 hover:border-cyan-400'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <p className={`text-xs font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {user.username}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <>
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                        <span>Admin</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Member</span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-xl border transition-all ${
                  dark
                    ? 'border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10'
                    : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  dark ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-700 hover:text-black hover:bg-slate-100'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className={`lg:hidden p-2 rounded-xl border transition ${
              dark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-3 space-y-1 backdrop-blur-xl ${
          dark ? 'bg-[#090d16]/95 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}>
          {links.map(l => {
            const IconComponent = l.icon
            const isActive = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                    : dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className="w-4 h-4" />
                  <span>{l.label}</span>
                </div>
                {l.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {l.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}

