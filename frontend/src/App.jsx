import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AIChatbot from './components/AIChatbot'
import Home from './pages/Home'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Badges from './pages/Badges'
import Bookmarks from './pages/Bookmarks'
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!hideNavbar && <AIChatbot />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
