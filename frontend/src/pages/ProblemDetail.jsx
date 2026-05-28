import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AIChatbot from '../components/AIChatbot'
import Discussion from '../components/Discussion'
import { useAuth } from '../context/AuthContext'

const starterCode = {
  'C++': `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    \n};`,
  Java: `class Solution {\n    // Write your solution here\n    \n}`,
  Python: `class Solution:\n    # Write your solution here\n    pass`,
}

const LANG_IDS = { 'C++': 54, Java: 62, Python: 71 }

const diffStyle = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
}

const STATUS_COLOR = {
  'Accepted': 'text-green-400',
  'Wrong Answer': 'text-red-400',
  'Time Limit Exceeded': 'text-yellow-400',
  'Compilation Error': 'text-orange-400',
  'Runtime Error (SIGSEGV)': 'text-red-400',
}

export default function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [problem, setProblem] = useState(null)
  const [lang, setLang] = useState('C++')
  const [code, setCode] = useState(starterCode['C++'])
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [bookmarked, setBookmarked] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  const [solved, setSolved] = useState(false)

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    fetch('http://localhost:5000/problems')
      .then(r => r.json())
      .then(data => {
        const found = data.find(p => p._id === id)
        setProblem(found)
        if (found && user) {
          axios.get('http://localhost:5000/user/bookmarks', { headers: authHeader })
            .then(r => setBookmarked(r.data.some(b => b._id === id || b === id)))
            .catch(() => {})
          axios.get(`http://localhost:5000/user/note/${id}`, { headers: authHeader })
            .then(r => setNote(r.data.note || ''))
            .catch(() => {})
        }
      })
      .finally(() => setLoading(false))
  }, [id, user])

  const toggleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    const res = await axios.post(`http://localhost:5000/user/bookmark/${id}`, {}, { headers: authHeader })
    setBookmarked(res.data.bookmarks.some(b => b.toString() === id))
    if (res.data.newBadges?.length) setNewBadges(res.data.newBadges)
  }

  const saveNote = async () => {
    if (!user) { navigate('/login'); return }
    await axios.post(`http://localhost:5000/user/note/${id}`, { note }, { headers: authHeader })
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput(null)
    try {
      const res = await axios.post('http://localhost:5000/api/execute',
        { code, language_id: LANG_IDS[lang], stdin: '' },
        { headers: authHeader }
      )
      setOutput(res.data)
    } catch {
      setOutput({ status: 'Error', stderr: 'Execution failed. Check backend.' })
    } finally { setRunning(false) }
  }

  const handleSubmit = async () => {
    setRunning(true)
    setOutput(null)
    try {
      const execRes = await axios.post('http://localhost:5000/api/execute',
        { code, language_id: LANG_IDS[lang], stdin: '' },
        { headers: authHeader }
      )
      setOutput(execRes.data)

      if (user && execRes.data.statusId === 3) {
        // Save submission
        await axios.post('http://localhost:5000/api/submission', {
          problemId: id, code, language: lang,
          status: execRes.data.status,
          runtime: execRes.data.time,
          memory: execRes.data.memory,
        }, { headers: authHeader })
        // Mark solved
        const solveRes = await axios.post(`http://localhost:5000/user/solve/${id}`, {}, { headers: authHeader })
        setSolved(true)
        if (solveRes.data.newBadges?.length) setNewBadges(solveRes.data.newBadges)
      }
    } catch {
      setOutput({ status: 'Error', stderr: 'Submission failed.' })
    } finally { setRunning(false) }
  }

  const handleLang = (l) => { setLang(l); setCode(starterCode[l]) }

  if (loading) return (
    <div className="pt-14 min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="text-gray-400 animate-pulse text-sm">Loading problem...</div>
    </div>
  )
  if (!problem) return (
    <div className="pt-14 min-h-screen flex items-center justify-center bg-[#0d1117]">
      <p className="text-gray-400">Problem not found. <span onClick={() => navigate('/problems')} className="text-cyan-400 cursor-pointer">Go back</span></p>
    </div>
  )

  return (
    <div className="pt-14 h-screen flex overflow-hidden bg-[#0d1117]">
      {/* Left Panel */}
      <div className="w-2/5 border-r border-gray-800 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#161b22] overflow-x-auto">
          {['description', 'approach', 'complexity', 'notes', 'discussion'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-3 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'
              }`}>
              {tab === 'complexity' ? '⏱ Complexity' : tab === 'approach' ? '💡 Approach' : tab === 'notes' ? '📝 Notes' : tab === 'discussion' ? '💬 Discussion' : '📄 Description'}
            </button>
          ))}
          <button onClick={toggleBookmark}
            className={`ml-auto px-4 py-3 text-lg transition ${bookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}>
            🔖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'description' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-lg font-bold text-white">{problem.title}</h1>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${diffStyle[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {problem.tags?.map(t => (
                  <span key={t} className="text-xs bg-[#0d1117] text-gray-400 px-2 py-0.5 rounded-full border border-gray-800">{t}</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
              {problem.hint && (
                <div className="mt-6 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">💡 Hint</p>
                  <p className="text-gray-300 text-sm">{problem.hint}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'approach' && (
            <div>
              <h2 className="text-white font-bold mb-4">💡 How to Approach</h2>
              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{problem.approach || 'No approach available yet.'}</p>
              </div>
              <div className="mt-4 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-xl">
                <p className="text-cyan-400 text-xs font-semibold mb-2">🧠 Key Concept</p>
                <p className="text-gray-300 text-sm">{problem.hint}</p>
              </div>
            </div>
          )}

          {activeTab === 'complexity' && (
            <div>
              <h2 className="text-white font-bold mb-4">⏱ Time & Space Complexity</h2>
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 mb-4">
                <p className="text-gray-400 text-xs">Time Complexity</p>
                <p className="text-cyan-400 font-bold text-xl font-mono">{problem.timeComplexity}</p>
              </div>
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                <p className="text-gray-400 text-xs">Space Complexity</p>
                <p className="text-purple-400 font-bold text-xl font-mono">{problem.spaceComplexity}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h2 className="text-white font-bold mb-3">📝 My Notes</h2>
              {!user && <p className="text-yellow-400 text-xs mb-3">⚠️ Login to save notes</p>}
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Write your notes here..."
                className="w-full h-48 bg-[#0d1117] border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-none" />
              <button onClick={saveNote} disabled={!user}
                className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold transition ${
                  noteSaved ? 'bg-green-400 text-black' : 'bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-40'
                }`}>
                {noteSaved ? '✅ Saved!' : '💾 Save Note'}
              </button>
            </div>
          )}

          {activeTab === 'discussion' && <Discussion problemId={id} />}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
          <div className="flex gap-1">
            {['C++', 'Java', 'Python'].map(l => (
              <button key={l} onClick={() => handleLang(l)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${lang === l ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleRun} disabled={running}
              className="px-4 py-1.5 text-xs font-semibold border border-gray-600 text-white rounded-lg hover:border-gray-400 transition disabled:opacity-50">
              {running ? '⏳ Running...' : '▶ Run'}
            </button>
            <button onClick={handleSubmit} disabled={running}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition disabled:opacity-50 ${solved ? 'bg-green-400 text-black' : 'bg-cyan-400 text-black hover:bg-cyan-300'}`}>
              {solved ? '✅ Solved!' : 'Submit'}
            </button>
          </div>
        </div>

        <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
          className="flex-1 bg-[#0d1117] text-green-300 font-mono text-sm p-5 resize-none focus:outline-none leading-relaxed"
          style={{ tabSize: 2 }} />

        {/* Output Panel */}
        {output && (
          <div className="border-t border-gray-800 bg-[#161b22] px-5 py-3 max-h-40 overflow-y-auto">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Output</p>
              <span className={`text-xs font-bold ${STATUS_COLOR[output.status] || 'text-gray-400'}`}>
                {output.status}
              </span>
              {output.time && <span className="text-xs text-gray-500">⏱ {output.time}s</span>}
              {output.memory && <span className="text-xs text-gray-500">💾 {output.memory}KB</span>}
            </div>
            {output.stdout && <pre className="text-green-300 text-xs font-mono whitespace-pre-wrap">{output.stdout}</pre>}
            {output.stderr && <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap">{output.stderr}</pre>}
            {output.compile_output && <pre className="text-orange-400 text-xs font-mono whitespace-pre-wrap">{output.compile_output}</pre>}
          </div>
        )}
      </div>

      <AIChatbot problemTitle={problem?.title} problemDescription={problem?.description} />

      {/* Badge Notification */}
      {newBadges.length > 0 && (
        <div className="fixed top-20 right-6 z-50 space-y-3">
          {newBadges.map((b, i) => (
            <div key={i} className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-2xl px-5 py-4 shadow-2xl animate-bounce flex items-center gap-3 max-w-xs">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <p className="text-yellow-400 font-black text-sm">🏅 Badge Earned!</p>
                <p className="text-white font-semibold text-sm">{b.name}</p>
                <p className="text-gray-400 text-xs">{b.description}</p>
              </div>
              <button onClick={() => setNewBadges([])} className="ml-auto text-gray-500 hover:text-white">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
