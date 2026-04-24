import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

// ── Starter Code ──
const STARTER = {
  'C++': `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    \n};`,
  Java: `class Solution {\n    // Write your solution here\n    \n}`,
  Python: `class Solution:\n    # Write your solution here\n    pass`,
  JavaScript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solve = function(nums, target) {\n    // Write your solution here\n};`,
}

const LANG_MAP = { 'C++': 'cpp', Java: 'java', Python: 'python', JavaScript: 'javascript' }

// ── Feedback Dashboard ──
function FeedbackDashboard({ score, onRestart }) {
  const [showSolution, setShowSolution] = useState(false)

  // Fix 1: Shorter labels to prevent overlap
  const radarData = [
    { subject: 'Problem', A: score.problemSolving },
    { subject: 'Coding', A: score.codingStyle },
    { subject: 'Comms', A: score.communication },
    { subject: 'Optimize', A: score.optimization },
    { subject: 'Edge Cases', A: score.edgeCases },
  ]

  return (
    <div className="min-h-screen bg-[#0d1117] pt-14 pb-10">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Fix 4: HIRE badge glowing animation */}
          <style>{`
            @keyframes hireGlow {
              0%, 100% { box-shadow: 0 0 15px rgba(74,222,128,0.4), 0 0 30px rgba(74,222,128,0.15); }
              50% { box-shadow: 0 0 35px rgba(74,222,128,0.7), 0 0 70px rgba(74,222,128,0.3); }
            }
          `}</style>
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-2xl font-black mb-4 ${
            score.verdict === 'HIRE'
              ? 'bg-green-400/10 border border-green-400/40 text-green-400'
              : 'bg-red-400/10 border border-red-400/30 text-red-400'
          }`}
          style={score.verdict === 'HIRE' ? { animation: 'hireGlow 2s ease-in-out infinite' } : {}}>
            {score.verdict === 'HIRE' ? '✅ HIRE' : '❌ NO HIRE'}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Interview Feedback Report</h1>
          <p className="text-gray-400 text-sm">Interviewed by Alex · Google · {new Date().toLocaleDateString()}</p>
        </div>

        {/* Final Score */}
        <div className="bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-3xl p-8 text-center mb-8">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Final Score</p>
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            {score.total}
          </div>
          <p className="text-gray-400">out of 100</p>
          <div className="mt-4 h-3 bg-gray-800 rounded-full max-w-md mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${score.total}%` }} />
          </div>
        </div>

        {/* Radar Chart + Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fix 1: outerRadius reduced + shorter labels = no overlap */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4 text-center">📊 Performance Radar</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="62%">
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} tickLine={false} />
                <Radar name="Score" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} strokeWidth={2.5} />
                <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #374151', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [`${v}/100`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 3 Pillars */}
          <div className="space-y-4">
            {[
              { label: 'Technical', icon: '⚙️', val: score.technical, bar: 'bg-cyan-400', txt: 'text-cyan-400', feedback: score.technicalFeedback },
              { label: 'Communication', icon: '🗣', val: score.communication, bar: 'bg-purple-400', txt: 'text-purple-400', feedback: score.communicationFeedback },
              { label: 'Logical Reasoning', icon: '🧠', val: score.logical, bar: 'bg-green-400', txt: 'text-green-400', feedback: score.logicalFeedback },
            ].map(p => (
              <div key={p.label} className="bg-[#161b22] border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{p.icon} {p.label}</span>
                  <span className={`text-lg font-black ${p.txt}`}>{p.val}/100</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full mb-2">
                  <div className={`h-full ${p.bar} rounded-full`} style={{ width: `${p.val}%` }} />
                </div>
                <p className="text-gray-400 text-xs">{p.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">💪 Key Strengths</h2>
            <div className="space-y-3">
              {score.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-400/10 text-green-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-gray-300 text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">🎯 Improvement Areas</h2>
            <div className="space-y-3">
              {score.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-gray-300 text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Fix 2: Edge Cases table — high contrast colors */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">⚠️ Edge Cases to Consider</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left py-2 pr-4">Edge Case</th>
                  <th className="text-left py-2 pr-4">Example</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {score.edgeCases_table.map((ec, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-3 pr-4 text-gray-300">{ec.case}</td>
                    <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{ec.example}</td>
                    <td className="py-3">
                      {ec.handled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
                          ✓ Handled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                          ✗ Missed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fix 3: Two buttons — Start New + View Suggested Solution */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={onRestart}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-400/25">
            🔄 Start New Interview
          </button>
          <button onClick={() => setShowSolution(s => !s)}
            className="border border-cyan-400/40 text-cyan-400 font-semibold px-8 py-3.5 rounded-xl hover:bg-cyan-400/10 hover:border-cyan-400 transition">
            💡 {showSolution ? 'Hide' : 'View'} Suggested Solution
          </button>
        </div>

        {/* Suggested Solution Panel */}
        {showSolution && (
          <div className="mt-6 bg-[#161b22] border border-cyan-400/20 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-3">💡 Suggested Solution</h2>
            <pre className="bg-[#0d1117] rounded-xl p-4 text-green-300 text-sm font-mono overflow-x-auto leading-relaxed">{`// Optimal O(n) solution using HashMap
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return []; // No solution found
}
// Time: O(n) | Space: O(n)`}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Interview Component ──
export default function Interview() {
  const location = useLocation()
  const problem = location.state?.problem || null

  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [started, setStarted] = useState(false)
  const [lang, setLang] = useState('C++')
  const [code, setCode] = useState(STARTER['C++'])
  const [codeApproved, setCodeApproved] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Check if AI approved coding
  useEffect(() => {
    const last = history[history.length - 1]
    if (last?.role === 'assistant') {
      const text = last.content.toLowerCase()
      if (text.includes('go ahead') || text.includes('implement it') || text.includes('start coding') || text.includes('sounds correct')) {
        setCodeApproved(true)
      }
    }
  }, [history])

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const clean = text.replace(/[*#`_]/g, '').slice(0, 400)
    const u = new SpeechSynthesisUtterance(clean)
    u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const v = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
    if (v) u.voice = v
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  const toggleListen = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Use Chrome for voice input'); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false) }
    r.onend = () => setListening(false)
    recognitionRef.current = r; r.start()
  }

  const startInterview = async () => {
    setStarted(true); setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/ai/interview', {
        message: "Start the interview. Greet me as Alex from Google and introduce the problem.",
        history: [], problem
      })
      const reply = res.data.reply
      setHistory([{ role: 'assistant', content: reply }])
      speak(reply)
    } catch { } finally { setLoading(false) }
  }

  const send = async (msg) => {
    const userMsg = (msg || input).trim()
    if (!userMsg || loading) return
    setInput('')
    const newHistory = [...history, { role: 'user', content: userMsg }]
    setHistory(newHistory)
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/ai/interview', {
        message: userMsg, history: newHistory.slice(-12), problem
      })
      const reply = res.data.reply
      setHistory(prev => [...prev, { role: 'assistant', content: reply }])
      speak(reply)
    } catch { } finally { setLoading(false) }
  }

  const submitCode = async () => {
    const msg = `I have submitted my code. Here is my solution:\n\`\`\`${lang}\n${code}\n\`\`\``
    await send(msg)
  }

  const endInterview = () => {
    window.speechSynthesis.cancel()
    setFeedback({
      total: 72,
      verdict: 'HIRE',
      technical: 75, technicalFeedback: 'Good use of HashMap for O(n) solution. Edge case handling was adequate.',
      communication: 70, communicationFeedback: 'Clear explanation of approach. Could improve by asking more clarifying questions upfront.',
      logical: 72, logicalFeedback: 'Correctly identified the optimal approach after initial hint. Good problem decomposition.',
      problemSolving: 75, codingStyle: 68, optimization: 72, edgeCases: 65,
      strengths: [
        'Correctly identified HashMap as the optimal data structure',
        'Explained time complexity O(n) clearly after prompting',
        'Handled the basic test case correctly in code',
      ],
      improvements: [
        'Ask clarifying questions proactively — e.g., "Can there be duplicate values?" before starting',
        'Consider edge cases like empty array or no valid pair before coding',
      ],
      edgeCases_table: [
        { case: 'Empty array', example: 'nums = []', handled: false },
        { case: 'Single element', example: 'nums = [5]', handled: false },
        { case: 'Duplicate values', example: 'nums = [3,3], target=6', handled: true },
        { case: 'Negative numbers', example: 'nums = [-1,2], target=1', handled: true },
        { case: 'No valid pair', example: 'nums = [1,2], target=10', handled: false },
      ]
    })
  }

  if (feedback) return <FeedbackDashboard score={feedback} onRestart={() => { setFeedback(null); setStarted(false); setHistory([]) }} />

  return (
    <div className="pt-14 h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Fix 4: Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-4xl text-center mb-4">⚠️</div>
            <h3 className="text-white font-bold text-lg text-center mb-2">End Interview?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              Are you sure you want to end the session? Your feedback report will be generated.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndConfirm(false)}
                className="flex-1 border border-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl hover:border-gray-500 hover:text-white transition text-sm">
                Continue Interview
              </button>
              <button onClick={() => { setShowEndConfirm(false); endInterview() }}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-400 transition text-sm">
                End & Get Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#161b22] border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg">🎙</span>
          <div>
            <p className="text-white text-sm font-semibold">AI Mock Interview — Alex (Google)</p>
            <p className="text-gray-500 text-xs">{problem ? `${problem.title} · ${problem.difficulty}` : 'General DSA'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {started && (
            <span className={`text-xs px-3 py-1 rounded-full ${
              speaking ? 'bg-green-400/10 text-green-400 animate-pulse' :
              listening ? 'bg-red-400/10 text-red-400 animate-pulse' :
              'bg-gray-800 text-gray-400'
            }`}>
              {speaking ? '🔊 Alex Speaking' : listening ? '🎤 Listening' : '● Live'}
            </span>
          )}
          {started && (
            <button onClick={() => setShowEndConfirm(true)}
              className="text-xs border border-red-400/30 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-400/10 transition">
              End Interview
            </button>
          )}
        </div>
      </div>

      {!started ? (
        /* Start Screen */
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-10 text-center max-w-lg">
            <div className="text-6xl mb-4">👨‍💼</div>
            <h2 className="text-white font-black text-2xl mb-2">Meet Alex</h2>
            <p className="text-cyan-400 text-sm mb-4">Senior Engineer · Google · 10+ years</p>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Alex will conduct a realistic technical interview. Explain your approach before coding, handle edge cases, and submit your solution.
            </p>
            {problem && (
              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-1">Today's Problem</p>
                <p className="text-white font-semibold">{problem.title}</p>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{problem.description}</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['🎤 Voice Input', '🔊 AI Voice', '💡 Smart Hints', '📊 Feedback Report'].map(f => (
                <span key={f} className="text-xs bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
            <button onClick={startInterview}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-400/25 w-full">
              Start Interview with Alex 🚀
            </button>
          </div>
        </div>
      ) : (
        /* Two Column Layout */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Chat (40%) */}
          <div className="w-[40%] flex flex-col border-r border-gray-800">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-bold'
                      : 'bg-[#0d1117] border border-gray-700 text-base'
                  }`}>
                    {msg.role === 'user' ? '👤' : '👨‍💼'}
                  </div>
                  {/* Fix 2: Markdown rendering in chat bubbles */}
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 text-white rounded-tr-sm'
                      : 'bg-[#0d1117] border border-gray-800 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          code: ({ inline, children }) => inline
                            ? <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                            : <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-2 overflow-x-auto"><code className="text-green-300 text-xs font-mono">{children}</code></pre>,
                          strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mt-1">{children}</ul>,
                          li: ({ children }) => <li className="text-gray-300">{children}</li>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                    {msg.role === 'assistant' && (
                      <button onClick={() => speak(msg.content)} className="block mt-1.5 text-xs text-gray-600 hover:text-cyan-400 transition">🔊 Replay</button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0d1117] border border-gray-700 flex items-center justify-center text-sm">👨‍💼</div>
                  <div className="bg-[#0d1117] border border-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">{[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-gray-800">
              {["Clarify constraints?", "I'll use HashMap O(n)", "Time: O(n), Space: O(n)", "Need a hint", "I have submitted my code"].map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-xs text-gray-400 bg-[#0d1117] border border-gray-700 px-2.5 py-1.5 rounded-full whitespace-nowrap hover:border-cyan-400/50 hover:text-cyan-400 transition flex-shrink-0">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-800 flex gap-2 items-end">
              {/* Fix 3: Pulsing green Live indicator when listening */}
              <div className="relative flex-shrink-0">
                <button onClick={toggleListen}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition text-sm ${
                    listening ? 'bg-red-400 text-white' : 'bg-[#0d1117] border border-gray-700 text-gray-400 hover:text-white'
                  }`}>🎤</button>
                {listening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d1117] animate-pulse" />
                )}
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={listening ? '🎤 Listening...' : 'Type your answer...'}
                rows={1}
                className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-none" />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-black hover:opacity-90 transition disabled:opacity-30 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT: Monaco Editor (60%) */}
          <div className="flex-1 flex flex-col bg-[#0d1117]">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <select value={lang} onChange={e => { setLang(e.target.value); setCode(STARTER[e.target.value]) }}
                  className="bg-[#0d1117] border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400">
                  {Object.keys(STARTER).map(l => <option key={l}>{l}</option>)}
                </select>
                {!codeApproved && (
                  <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                    🔒 Explain approach first
                  </span>
                )}
                {codeApproved && (
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                    ✅ Approach approved — start coding!
                  </span>
                )}
              </div>
              <button onClick={submitCode}
                disabled={!codeApproved}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-5 py-1.5 rounded-lg text-xs hover:opacity-90 transition disabled:opacity-30">
                Submit Code →
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              {/* Fix 1: Sidebar notification instead of blocking overlay */}
              {!codeApproved && (
                <div className="absolute top-3 right-3 z-10 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0" />
                  Explain approach to Alex first
                </div>
              )}
              {codeApproved && (
                <div className="absolute top-3 right-3 z-10 bg-green-400/10 border border-green-400/30 text-green-400 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                  Approach approved — code away!
                </div>
              )}
              <Editor
                height="100%"
                language={LANG_MAP[lang]}
                value={code}
                onChange={v => setCode(v || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
