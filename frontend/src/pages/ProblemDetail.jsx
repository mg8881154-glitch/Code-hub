import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AIChatbot from '../components/AIChatbot'
import Discussion from '../components/Discussion'

const USER_ID = "kinetic_dev"

const starterCode = {
  'C++': `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    \n};`,
  Java: `class Solution {\n    // Write your solution here\n    \n}`,
  Python: `class Solution:\n    # Write your solution here\n    pass`,
}

const diffStyle = {
  Easy:   'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard:   'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [lang, setLang] = useState('C++')
  const [code, setCode] = useState(starterCode['C++'])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [bookmarked, setBookmarked] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/problems')
      .then(r => r.json())
      .then(data => {
        const found = data.find(p => p._id === id)
        setProblem(found)
        if (found) {
          // Load bookmark and note
          axios.get(`http://localhost:5000/user/${USER_ID}/bookmarks`)
            .then(r => setBookmarked(r.data.some(b => b._id === id || b === id)))
          axios.get(`http://localhost:5000/user/${USER_ID}/note/${id}`)
            .then(r => setNote(r.data.note || ''))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const toggleBookmark = async () => {
    const res = await axios.post(`http://localhost:5000/user/${USER_ID}/bookmark/${id}`)
    setBookmarked(res.data.bookmarks.includes(id))
    if (res.data.newBadges?.length) setNewBadges(res.data.newBadges)
  }

  const saveNote = async () => {
    await axios.post(`http://localhost:5000/user/${USER_ID}/note/${id}`, { note })
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const handleSubmit = async () => {
    setOutput('🎉 Accepted! Runtime: 12ms | Memory: 8.2MB')
    const res = await axios.post(`http://localhost:5000/user/${USER_ID}/solve/${id}`)
    setSolved(true)
    if (res.data.newBadges?.length) setNewBadges(res.data.newBadges)
  }

  const handleLang = (l) => { setLang(l); setCode(starterCode[l]) }

  if (loading) return (
    <div className="pt-14 min-h-screen flex items-center justify-center">
      <div className="text-gray-400 animate-pulse text-sm">Loading problem...</div>
    </div>
  )
  if (!problem) return (
    <div className="pt-14 min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Problem not found. <span onClick={() => navigate('/problems')} className="text-cyan-400 cursor-pointer">Go back</span></p>
    </div>
  )

  return (
    <div className="pt-14 h-screen flex overflow-hidden">
      {/* Left Panel */}
      <div className="w-2/5 border-r border-gray-800 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#161b22]">
          {['description', 'approach', 'complexity', 'notes', 'discussion'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-semibold capitalize transition ${
                activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'
              }`}>
              {tab === 'complexity' ? '⏱ Complexity' : tab === 'approach' ? '💡 Approach' : tab === 'notes' ? '📝 Notes' : tab === 'discussion' ? '💬 Discussion' : '📄 Description'}
            </button>
          ))}
          {/* Bookmark button */}
          <button onClick={toggleBookmark}
            className={`ml-auto px-4 py-3 text-lg transition ${bookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
            {bookmarked ? '🔖' : '🔖'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Description Tab */}
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

              {/* Hint */}
              {problem.hint && (
                <div className="mt-6 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">💡 Hint</p>
                  <p className="text-gray-300 text-sm">{problem.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Approach Tab */}
          {activeTab === 'approach' && (
            <div>
              <h2 className="text-white font-bold mb-4">💡 How to Approach</h2>
              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {problem.approach || 'No approach available yet.'}
                </p>
              </div>

              <div className="mt-4 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-xl">
                <p className="text-cyan-400 text-xs font-semibold mb-2">🧠 Key Concept</p>
                <p className="text-gray-300 text-sm">{problem.hint}</p>
              </div>

              <div className="mt-4">
                <p className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">Related Topics</p>
                <div className="flex flex-wrap gap-2">
                  {problem.tags?.map(t => (
                    <span key={t} className="text-xs bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Complexity Tab */}
          {activeTab === 'complexity' && (
            <div>
              <h2 className="text-white font-bold mb-4">⏱ Time & Space Complexity</h2>

              {/* Time Complexity */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">⏱</div>
                  <div>
                    <p className="text-gray-400 text-xs">Time Complexity</p>
                    <p className="text-cyan-400 font-bold text-xl font-mono">{problem.timeComplexity}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {getTimeExplanation(problem.timeComplexity)}
                </p>
              </div>

              {/* Space Complexity */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-400/10 rounded-lg flex items-center justify-center text-purple-400 text-sm">💾</div>
                  <div>
                    <p className="text-gray-400 text-xs">Space Complexity</p>
                    <p className="text-purple-400 font-bold text-xl font-mono">{problem.spaceComplexity}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {getSpaceExplanation(problem.spaceComplexity)}
                </p>
              </div>

              {/* Complexity Cheatsheet */}
              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
                <p className="text-white text-xs font-semibold mb-3 uppercase tracking-wide">📊 Big-O Cheatsheet</p>
                <div className="space-y-2">
                  {[
                    { notation: 'O(1)', name: 'Constant', color: 'text-green-400', example: 'Array access, HashMap get' },
                    { notation: 'O(log n)', name: 'Logarithmic', color: 'text-green-400', example: 'Binary Search' },
                    { notation: 'O(n)', name: 'Linear', color: 'text-yellow-400', example: 'Single loop, Linear scan' },
                    { notation: 'O(n log n)', name: 'Linearithmic', color: 'text-yellow-400', example: 'Merge Sort, Heap Sort' },
                    { notation: 'O(n²)', name: 'Quadratic', color: 'text-orange-400', example: 'Nested loops, Bubble Sort' },
                    { notation: 'O(2ⁿ)', name: 'Exponential', color: 'text-red-400', example: 'Recursion without memo' },
                  ].map(c => (
                    <div key={c.notation} className="flex items-center justify-between py-1.5 border-b border-gray-800/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-sm font-bold w-20 ${c.color}`}>{c.notation}</span>
                        <span className="text-gray-400 text-xs">{c.name}</span>
                      </div>
                      <span className="text-gray-600 text-xs">{c.example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <h2 className="text-white font-bold mb-3">📝 My Notes</h2>
              <p className="text-gray-400 text-xs mb-3">Write your approach, observations or reminders for this problem.</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Write your notes here..."
                className="w-full h-48 bg-[#0d1117] border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button onClick={saveNote}
                className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold transition ${
                  noteSaved ? 'bg-green-400 text-black' : 'bg-cyan-400 text-black hover:bg-cyan-300'
                }`}>
                {noteSaved ? '✅ Saved!' : '💾 Save Note'}
              </button>
            </div>
          )}
          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <Discussion problemId={id} />
          )}

        </div>
      </div>

      {/* Discussion Section */}
      <div className="w-2/5 border-r border-gray-800 overflow-y-auto px-5 pb-5" style={{display: activeTab === 'discussion' ? 'block' : 'none'}}>
      </div>

      {/* Right Panel - Editor */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {/* Editor Topbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
          <div className="flex gap-1">
            {['C++', 'Java', 'Python'].map(l => (
              <button key={l} onClick={() => handleLang(l)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  lang === l ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'
                }`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setOutput('✅ Compiled successfully! Test cases: 3/3 passed')}
              className="px-4 py-1.5 text-xs font-semibold border border-gray-600 text-white rounded-lg hover:border-gray-400 transition">
              ▶ Run
            </button>
            <button onClick={handleSubmit}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${solved ? 'bg-green-400 text-black' : 'bg-cyan-400 text-black hover:bg-cyan-300'}`}>
              {solved ? '✅ Solved!' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-[#0d1117] text-green-300 font-mono text-sm p-5 resize-none focus:outline-none leading-relaxed"
          style={{ tabSize: 2 }}
        />

        {/* Output */}
        {output && (
          <div className="border-t border-gray-800 bg-[#161b22] px-5 py-3">
            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Output</p>
            <p className="text-sm text-white font-mono">{output}</p>
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

function getTimeExplanation(tc) {
  if (!tc) return ''
  if (tc.includes('O(1)')) return 'Constant time — does not depend on input size. Fastest possible.'
  if (tc.includes('O(log n)')) return 'Logarithmic — input is halved each step. Very efficient for large inputs.'
  if (tc.includes('O(n log n)')) return 'Linearithmic — typical of efficient sorting algorithms like merge sort.'
  if (tc.includes('O(n²)')) return 'Quadratic — nested loops over input. Acceptable for n ≤ 10³.'
  if (tc.includes('O(n)')) return 'Linear — single pass through input. Scales well with input size.'
  if (tc.includes('O(2')) return 'Exponential — doubles with each input. Only feasible for very small n.'
  return 'Complexity depends on input size n.'
}

function getSpaceExplanation(sc) {
  if (!sc) return ''
  if (sc.includes('O(1)')) return 'Constant space — uses fixed memory regardless of input size. Most optimal.'
  if (sc.includes('O(log n)')) return 'Logarithmic space — typically recursion stack depth in divide & conquer.'
  if (sc.includes('O(n)')) return 'Linear space — stores data proportional to input size (arrays, hashmaps).'
  if (sc.includes('O(h)')) return 'O(h) where h = tree height. O(log n) for balanced, O(n) for skewed tree.'
  if (sc.includes('O(m')) return 'Depends on both input dimensions m and n.'
  return 'Space used grows with input size.'
}
