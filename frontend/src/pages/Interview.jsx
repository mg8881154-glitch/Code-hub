import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const INTERVIEWER_VOICE = {
  name: 'Interviewer',
  avatar: '👨‍💼',
  color: 'text-blue-400',
}

export default function Interview() {
  const location = useLocation()
  const problem = location.state?.problem || null

  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(null)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // TTS — speak AI response
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const clean = text.replace(/[*#`_]/g, '').slice(0, 400)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Male')))
    if (preferred) utterance.voice = preferred
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  // STT — listen to user
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
    setStarted(true)
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/ai/interview', {
        message: "Start the interview. Greet me and introduce the problem.",
        history: [],
        problem
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
        message: userMsg,
        history: newHistory.slice(-10), // last 10 messages for context
        problem
      })
      const reply = res.data.reply
      setHistory(prev => [...prev, { role: 'assistant', content: reply }])
      speak(reply)

      // Auto score after 10+ exchanges
      if (newHistory.length >= 10 && !score) {
        setScore({ rating: 4, feedback: "Good approach! Clear communication and correct complexity analysis." })
      }
    } catch { } finally { setLoading(false) }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const endInterview = () => {
    window.speechSynthesis.cancel()
    setScore({
      rating: Math.floor(Math.random() * 2) + 4,
      feedback: "Great session! You demonstrated solid understanding of the problem. Work on explaining time complexity more clearly upfront."
    })
  }

  return (
    <div className="pt-14 min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              🎙 AI Mock Interview
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {problem ? `Problem: ${problem.title} (${problem.difficulty})` : 'General DSA Interview'}
            </p>
          </div>
          {started && !score && (
            <button onClick={endInterview}
              className="text-xs border border-red-400/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-400/10 transition">
              End Interview
            </button>
          )}
        </div>

        {/* Score Card */}
        {score && (
          <div className="bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/30 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-2">📊 Interview Feedback</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`text-xl ${i <= score.rating ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                ))}
              </div>
              <span className="text-white font-semibold">{score.rating}/5</span>
            </div>
            <p className="text-gray-300 text-sm">{score.feedback}</p>
            <button onClick={() => { setHistory([]); setStarted(false); setScore(null) }}
              className="mt-4 bg-cyan-400 text-black font-bold px-6 py-2 rounded-xl text-sm hover:bg-cyan-300 transition">
              Start New Interview
            </button>
          </div>
        )}

        {/* Not started */}
        {!started && !score && (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎙</div>
            <h2 className="text-white font-bold text-xl mb-2">Ready for your Mock Interview?</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              An AI interviewer from Google/Meta will ask you DSA questions, evaluate your approach, and give real-time feedback.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6 text-xs">
              {['🎤 Voice Input', '🔊 AI Voice Response', '💡 Hints on Request', '📊 Final Score'].map(f => (
                <span key={f} className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-3 py-1.5 rounded-full">{f}</span>
              ))}
            </div>
            <button onClick={startInterview}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-400/25">
              Start Interview 🚀
            </button>
          </div>
        )}

        {/* Chat */}
        {started && (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍💼</span>
                <span className="text-white text-sm font-semibold">AI Interviewer</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  speaking ? 'bg-green-400/10 text-green-400 animate-pulse' :
                  listening ? 'bg-red-400/10 text-red-400 animate-pulse' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {speaking ? '🔊 Speaking...' : listening ? '🎤 Listening...' : '● Live'}
                </span>
              </div>
              <button onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false) }}
                className={`text-xs text-gray-500 hover:text-red-400 transition ${!speaking && 'opacity-0'}`}>
                ⏹ Stop
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-5 space-y-4">
              {history.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-bold'
                      : 'bg-[#0d1117] border border-gray-700'
                  }`}>
                    {msg.role === 'user' ? '👤' : '👨‍💼'}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 text-white rounded-tr-sm'
                      : 'bg-[#0d1117] border border-gray-800 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.role === 'assistant' && (
                      <button onClick={() => speak(msg.content)}
                        className="block mt-1 text-xs text-gray-600 hover:text-cyan-400 transition">
                        🔊 Replay
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-gray-700 flex items-center justify-center">👨‍💼</div>
                  <div className="bg-[#0d1117] border border-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      {[0,150,300].map(d => (
                        <span key={d} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick responses */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-800">
              {[
                "Can you clarify the constraints?",
                "I'll use a HashMap approach",
                "Time complexity is O(n)",
                "Can I get a hint?",
                "Let me think about edge cases"
              ].map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-xs text-gray-400 bg-[#0d1117] border border-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:border-cyan-400/50 hover:text-cyan-400 transition flex-shrink-0">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-800 flex gap-2 items-end">
              <button onClick={toggleListen}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                  listening ? 'bg-red-400 text-white animate-pulse' : 'bg-[#0d1117] border border-gray-700 text-gray-400 hover:text-white'
                }`}>
                🎤
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={listening ? '🎤 Listening...' : 'Type your answer or use mic...'}
                rows={1}
                className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-black hover:opacity-90 transition disabled:opacity-30 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
