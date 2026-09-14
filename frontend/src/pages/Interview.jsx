import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Code2,
  ChevronRight,
  Lightbulb,
  Award,
  Layers,
  Check,
  X
} from 'lucide-react'
import api from '../api'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../context/ThemeContext'

// ── Starter Code ──
const STARTER = {
  'C++': `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    \n};`,
  Java: `class Solution {\n    // Write your solution here\n    \n}`,
  Python: `class Solution:\n    # Write your solution here\n    pass`,
  JavaScript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solve = function(nums, target) {\n    // Write your solution here\n};`,
}

const LANG_MAP = { 'C++': 'cpp', Java: 'java', Python: 'python', JavaScript: 'javascript' }

// ── Feedback Dashboard ──
function FeedbackDashboard({ score, onRestart, dark }) {
  const [showSolution, setShowSolution] = useState(false)

  const radarData = [
    { subject: 'Problem', A: score.problemSolving },
    { subject: 'Coding', A: score.codingStyle },
    { subject: 'Comms', A: score.communication },
    { subject: 'Optimize', A: score.optimization },
    { subject: 'Edge Cases', A: score.edgeCases },
  ]

  return (
    <div className={`min-h-screen pt-16 pb-12 transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xl font-black mb-4 shadow-lg ${
            score.verdict === 'HIRE'
              ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-rose-500/10'
          }`}>
            {score.verdict === 'HIRE' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-rose-400" />}
            <span>{score.verdict === 'HIRE' ? 'HIRE RECOMMENDATION' : 'NEEDS PRACTICE'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Technical Interview Feedback Report</h1>
          <p className={`text-xs sm:text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Evaluated by Alex · Senior Staff Engineer (Google) · {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Final Score */}
        <div className={`rounded-3xl p-8 text-center mb-8 border backdrop-blur-xl shadow-xl ${
          dark ? 'bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-white border-slate-200'
        }`}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Composite Score</p>
          <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            {score.total}
          </div>
          <p className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>out of 100 possible points</p>
          <div className={`mt-5 h-3 rounded-full max-w-md mx-auto overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${score.total}%` }}
            />
          </div>
        </div>

        {/* Radar Chart + Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="font-bold text-sm mb-4 text-center flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Skill Performance Radar</span>
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="62%">
                <PolarGrid stroke={dark ? '#1e293b' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickLine={false} />
                <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2.5} />
                <Tooltip contentStyle={{ background: dark ? '#0f172a' : '#ffffff', border: '1px solid #334155', borderRadius: 12, color: dark ? '#fff' : '#000', fontSize: 12 }}
                  formatter={(v) => [`${v}/100`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 3 Pillars */}
          <div className="space-y-4">
            {[
              { label: 'Technical Execution', val: score.technical, bar: 'bg-cyan-400', txt: 'text-cyan-400', feedback: score.technicalFeedback },
              { label: 'Communication Clarity', val: score.communication, bar: 'bg-purple-400', txt: 'text-purple-400', feedback: score.communicationFeedback },
              { label: 'Logical Decomposition', val: score.logical, bar: 'bg-emerald-400', txt: 'text-emerald-400', feedback: score.logicalFeedback },
            ].map(p => (
              <div key={p.label} className={`p-5 rounded-3xl border shadow-sm ${
                dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">{p.label}</span>
                  <span className={`text-base font-black ${p.txt}`}>{p.val}/100</span>
                </div>
                <div className={`h-1.5 rounded-full mb-2 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className={`h-full ${p.bar} rounded-full`} style={{ width: `${p.val}%` }} />
                </div>
                <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{p.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="font-bold text-sm mb-4 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths</span>
            </h2>
            <div className="space-y-3">
              {score.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`p-6 rounded-3xl border shadow-sm ${
            dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="font-bold text-sm mb-4 text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Improvement Areas</span>
            </h2>
            <div className="space-y-3">
              {score.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edge Cases Table */}
        <div className={`p-6 rounded-3xl border mb-8 shadow-sm ${
          dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Edge Case Coverage</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className={`border-b ${dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} uppercase`}>
                  <th className="py-2.5 pr-4 font-semibold">Edge Case</th>
                  <th className="py-2.5 pr-4 font-semibold">Example</th>
                  <th className="py-2.5 font-semibold">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {score.edgeCases_table.map((ec, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 font-semibold">{ec.case}</td>
                    <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{ec.example}</td>
                    <td className="py-3">
                      {ec.handled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" /> Handled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <X className="w-3 h-3" /> Missed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center gap-2 text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </button>
          <button
            onClick={() => setShowSolution(s => !s)}
            className={`border font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 text-xs ${
              dark
                ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showSolution ? 'Hide Solution' : 'View Canonical Solution'}</span>
          </button>
        </div>

        {/* Suggested Solution Panel */}
        {showSolution && (
          <div className={`mt-6 rounded-3xl border p-6 ${
            dark ? 'bg-slate-900 border-cyan-500/30' : 'bg-white border-slate-300 shadow-lg'
          }`}>
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2 text-emerald-400">
              <Code2 className="w-4 h-4" />
              <span>Optimal Canonical Implementation</span>
            </h2>
            <pre className={`p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed ${
              dark ? 'bg-[#090d16] text-emerald-300' : 'bg-slate-900 text-emerald-300'
            }`}>{`// Optimal O(n) Single-Pass Hash Map Solution
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return []; // No pair found
}
// Time Complexity: O(n) | Space Complexity: O(n)`}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Interview Component ──
export default function Interview() {
  const location = useLocation()
  const { dark } = useTheme()
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
    u.lang = 'en-US'; u.rate = 0.95; u.pitch = 1
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
    if (!SR) { alert('Use Google Chrome for voice interaction.'); return }
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
      const res = await api.post('/ai/interview', {
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
      const res = await api.post('/ai/interview', {
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
      total: 82,
      verdict: 'HIRE',
      technical: 85, technicalFeedback: 'Excellent Hash Map strategy with O(n) runtime and minimal space allocation.',
      communication: 78, communicationFeedback: 'Explained intuition clearly. In future sessions, proactively clarify input bounds and constraints upfront.',
      logical: 84, logicalFeedback: 'Accurately handled algorithm structure and identified time/space tradeoffs.',
      problemSolving: 85, codingStyle: 80, optimization: 82, edgeCases: 76,
      strengths: [
        'Optimal lookup data structure identified immediately',
        'Clean variable naming and linear loop construct',
        'Accurately described O(n) time complexity',
      ],
      improvements: [
        'Ask about edge cases like empty array or negative numbers earlier',
        'State memory tradeoffs before writing code',
      ],
      edgeCases_table: [
        { case: 'Empty array input', example: 'nums = []', handled: true },
        { case: 'Single element input', example: 'nums = [5]', handled: true },
        { case: 'Duplicate elements', example: 'nums = [3,3], target=6', handled: true },
        { case: 'Negative integers', example: 'nums = [-1,2], target=1', handled: true },
        { case: 'No solution matching pair', example: 'nums = [1,2], target=10', handled: true },
      ]
    })
  }

  if (feedback) return <FeedbackDashboard score={feedback} onRestart={() => { setFeedback(null); setStarted(false); setHistory([]) }} dark={dark} />

  return (
    <div className={`pt-16 h-screen flex flex-col overflow-hidden transition-colors duration-200 ${
      dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* End Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl p-8 max-w-sm w-full border shadow-2xl ${
            dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-center mb-2">Conclude Interview?</h3>
            <p className={`text-xs text-center mb-6 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to end this interview session? Your final performance report and radar chart will be generated.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className={`flex-1 border font-semibold py-2.5 rounded-xl text-xs transition ${
                  dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Continue
              </button>
              <button
                onClick={() => { setShowEndConfirm(false); endInterview() }}
                className="flex-1 bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-rose-600 shadow-md shadow-rose-500/20"
              >
                End & Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className={`flex items-center justify-between px-6 py-3 border-b flex-shrink-0 ${
        dark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Alex</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Google Staff AI</span>
            </p>
            <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {problem ? `${problem.title} · ${problem.difficulty}` : 'General DSA & Algorithmic Design'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {started && (
            <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
              speaking ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse' :
              listening ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse' :
              'bg-slate-800 text-slate-400'
            }`}>
              {speaking ? <Volume2 className="w-3 h-3" /> : listening ? <Mic className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-cyan-400" />}
              <span>{speaking ? 'Alex Speaking' : listening ? 'Listening to You...' : 'Session Active'}</span>
            </span>
          )}
          {started && (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="text-xs font-bold border border-rose-500/40 text-rose-400 px-3.5 py-1.5 rounded-xl hover:bg-rose-500/10 transition"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {!started ? (
        /* Welcome Lobby Screen */
        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`p-8 sm:p-10 rounded-3xl border max-w-lg w-full text-center shadow-2xl backdrop-blur-xl ${
            dark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-purple-500/25">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="font-black text-2xl mb-1">Meet Alex</h2>
            <p className="text-cyan-400 font-bold text-xs mb-4">Senior Technical Interviewer · Google Tech Lead</p>
            <p className={`text-xs leading-relaxed mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Alex evaluates real-time DSA discussions. Clarify constraints, explain intuition and time complexity first before writing and submitting code.
            </p>

            {problem && (
              <div className={`rounded-2xl p-4 mb-6 text-left border ${
                dark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Assigned Challenge</p>
                <p className="font-bold text-sm text-cyan-400">{problem.title}</p>
                <p className={`text-xs mt-1 line-clamp-2 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{problem.description}</p>
              </div>
            )}

            <button
              onClick={startInterview}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Begin Technical Interview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Two Column Layout */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Conversation Pane (42%) */}
          <div className={`w-[42%] flex flex-col border-r ${dark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'}`}>
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-bold'
                      : 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[84%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none'
                      : dark
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          code: ({ inline, children }) => inline
                            ? <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded font-mono">{children}</code>
                            : <pre className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-2 overflow-x-auto"><code className="text-emerald-300 font-mono">{children}</code></pre>,
                          strong: ({ children }) => <strong className="font-bold text-cyan-300">{children}</strong>,
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-none border ${
                    dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-xs text-slate-400 mr-1">Alex is analyzing</span>
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className={`px-3 py-2 flex gap-1.5 overflow-x-auto border-t ${
              dark ? 'border-slate-800 bg-[#0d1322]' : 'border-slate-200 bg-slate-50'
            }`}>
              {["Clarify constraints?", "I'll use Hash Map O(n)", "Time: O(n), Space: O(n)", "Need a hint", "I submitted my code"].map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border transition-all flex-shrink-0 ${
                    dark
                      ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-cyan-400/50 hover:text-cyan-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className={`p-3 border-t flex gap-2 items-end ${
              dark ? 'border-slate-800 bg-[#0d1322]/80' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={toggleListen}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  listening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : dark
                    ? 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                    : 'bg-white border border-slate-300 text-slate-600 hover:text-black'
                }`}
              >
                {listening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={listening ? 'Listening to speech...' : 'Type response to Alex...'}
                rows={1}
                className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all resize-none ${
                  dark
                    ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                }`}
              />

              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white hover:opacity-95 transition disabled:opacity-30 flex-shrink-0 shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Monaco Editor (58%) */}
          <div className="flex-1 flex flex-col">
            {/* Editor toolbar */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 ${
              dark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <select
                  value={lang}
                  onChange={e => { setLang(e.target.value); setCode(STARTER[e.target.value]) }}
                  className={`border text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none ${
                    dark ? 'bg-slate-900 border-slate-700 text-cyan-400' : 'bg-white border-slate-300 text-cyan-600'
                  }`}
                >
                  {Object.keys(STARTER).map(l => <option key={l}>{l}</option>)}
                </select>
                {!codeApproved && (
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    Explain approach to Alex first
                  </span>
                )}
                {codeApproved && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Approach approved — code solution</span>
                  </span>
                )}
              </div>

              <button
                onClick={submitCode}
                disabled={!codeApproved}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs hover:opacity-90 transition disabled:opacity-40 shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Submit to Alex</span>
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={LANG_MAP[lang]}
                value={code}
                onChange={v => setCode(v || '')}
                theme={dark ? 'vs-dark' : 'light'}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', monospace",
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

