import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import AIChatbot from './components/AIChatbot'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Badges from './pages/Badges'
import Bookmarks from './pages/Bookmarks'
import Interview from './pages/Interview'
import Login from './pages/Login'
import Signup from './pages/Signup'

function AppContent() {
  const { pathname } = useLocation()
  const hideNavbar = pathname === '/login' || pathname === '/signup'

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
      {!hideNavbar && <AIChatbot />}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
