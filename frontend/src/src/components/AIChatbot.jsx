import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const EMOJIS = ['😊','🤔','💡','🔥','👍','❤️','😮','🎯','⚡','🧠']

export default function AIChatbot({ problemTitle, problemDescription }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: problemTitle
        ? `👋 Hi! I'm your **CodeHub AI Assistant**!\n\nI see you're working on **"${problemTitle}"** 🎯\n\nAsk me anything — hints, approach, time complexity, or examples. I'm here to help! 🚀`
        : `👋 Hi! I'm your **CodeHub AI Assistant**! 🤖\n\nI can help you with:\n• 📚 DSA concepts\n• ⏱ Time & Space complexity\n• 💡 Problem-solving approaches\n• 🌳 Trees, Graphs, DP and more!\n\nType or use 🎤 mic to ask anything!`,
      feedback: null,
      showEmoji: false,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Text to Speech ──
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const clean = text.replace(/[*#`_]/g, '').slice(0, 600)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'en-US'; utterance.rate = 0.95; utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false) }

  // ── Speech to Text ──
  const toggleListening = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Use Chrome for voice input.'); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false) }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recognitionRef.current = r; r.start()
  }

  // ── Send Message ──
  const send = async (msg) => {
    const userMsg = (msg || input).trim()
    if (!userMsg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg, feedback: null, showEmoji: false }])
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/ai/chat', { message: userMsg, problemTitle, problemDescription })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: 'ai', text: reply, feedback: null, showEmoji: false }])
      speak(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '❌ AI unavailable. Make sure backend is running on port 5000.', feedback: null, showEmoji: false }])
    } finally { setLoading(false) }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  // ── Feedback ──
  const setFeedback = (idx, type) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, feedback: type } : m))
  }

  // ── Emoji React ──
  const addEmoji = (idx, emoji) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, reaction: emoji, showEmoji: false } : m))
    setShowEmojiPicker(null)
  }

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded text-cyan-300 text-xs">$1</code>')
      .replace(/•/g, '•')
  }

  const quickPrompts = problemTitle ? [
    { icon: '💡', text: 'Give me a hint' },
    { icon: '🧠', text: 'Explain the approach' },
    { icon: '⏱', text: 'Time complexity?' },
    { icon: '📝', text: 'Show an example' },
    { icon: '🔍', text: 'Edge cases?' },
  ] : [
    { icon: '📚', text: 'Explain Binary Search' },
    { icon: '🌳', text: 'DFS vs BFS?' },
    { icon: '💡', text: 'How does DP work?' },
    { icon: '⏱', text: 'What is Big O?' },
    { icon: '🔗', text: 'Linked List basics' },
  ]

  return (
    <>
      {/* FAB Button */}
      <button onClick={() => { setOpen(!open); setMinimized(false) }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          speaking ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/50 animate-pulse' :
          listening ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-400/50 animate-pulse' :
          'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-400/40 hover:shadow-cyan-400/60'
        }`}>
        {open ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
        {/* Unread dot */}
        {!open && <span className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-[#0d1117]"></span>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className={`fixed bottom-28 right-6 z-50 bg-[#161b22] border border-gray-700/80 rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden transition-all duration-300 ${
          minimized ? 'w-80 h-16' : 'w-[420px] h-[620px]'
        }`}>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-gray-800 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-lg shadow-lg">🤖</div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d1117]"></span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">CodeHub AI</p>
              <p className={`text-xs flex items-center gap-1 ${speaking ? 'text-green-400' : listening ? 'text-red-400' : 'text-gray-400'}`}>
                {speaking ? '🔊 Speaking...' : listening ? '🎤 Listening...' : '✨ Powered by Llama 3.3'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {speaking && (
                <button onClick={stopSpeaking} className="text-xs text-red-400 border border-red-400/30 px-2 py-1 rounded-lg hover:bg-red-400/10 transition">⏹</button>
              )}
              <button onClick={() => setMinimized(!minimized)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
                {minimized ? '⬆' : '⬇'}
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">✕</button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-gradient-to-br from-purple-400 to-pink-500' : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                      }`}>
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>

                      {/* Bubble */}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-br-sm shadow-lg shadow-cyan-400/20'
                          : 'bg-[#0d1117] text-gray-200 border border-gray-800/80 rounded-bl-sm shadow-lg'
                      }`}>
                        <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />

                        {/* Reaction */}
                        {msg.reaction && (
                          <span className="mt-1 text-base block">{msg.reaction}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className={`flex items-center gap-2 mt-1 px-9 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* AI message actions */}
                      {msg.role === 'ai' && (
                        <>
                          {/* Listen */}
                          <button onClick={() => speak(msg.text)} className="text-xs text-gray-500 hover:text-cyan-400 transition flex items-center gap-0.5">
                            🔊
                          </button>
                          {/* Thumbs up */}
                          <button onClick={() => setFeedback(i, 'up')}
                            className={`text-xs transition ${msg.feedback === 'up' ? 'text-green-400' : 'text-gray-500 hover:text-green-400'}`}>
                            👍
                          </button>
                          {/* Thumbs down */}
                          <button onClick={() => setFeedback(i, 'down')}
                            className={`text-xs transition ${msg.feedback === 'down' ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
                            👎
                          </button>
                          {/* Emoji react */}
                          <div className="relative">
                            <button onClick={() => setShowEmojiPicker(showEmojiPicker === i ? null : i)}
                              className="text-xs text-gray-500 hover:text-yellow-400 transition">
                              😊
                            </button>
                            {showEmojiPicker === i && (
                              <div className="absolute bottom-6 left-0 bg-[#1a1d2e] border border-gray-700 rounded-xl p-2 flex flex-wrap gap-1 w-40 z-10 shadow-xl">
                                {EMOJIS.map(e => (
                                  <button key={e} onClick={() => addEmoji(i, e)} className="text-base hover:scale-125 transition">{e}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Feedback text */}
                          {msg.feedback === 'up' && <span className="text-xs text-green-400">Helpful!</span>}
                          {msg.feedback === 'down' && <span className="text-xs text-red-400">Got it, I'll improve!</span>}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm">🤖</div>
                    <div className="bg-[#0d1117] border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-gray-400 mr-1">Thinking</span>
                        {[0,150,300].map(d => (
                          <span key={d} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-800/60 flex-shrink-0">
                {quickPrompts.map((p, i) => (
                  <button key={i} onClick={() => send(p.text)}
                    className="text-xs text-gray-300 bg-[#0d1117] border border-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:border-cyan-400/50 hover:text-cyan-400 transition flex-shrink-0 flex items-center gap-1">
                    <span>{p.icon}</span> {p.text}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-800/60 flex gap-2 items-end flex-shrink-0 bg-[#0d1117]/50">
                {/* Mic */}
                <button onClick={toggleListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                    listening ? 'bg-red-400 text-white animate-pulse shadow-lg shadow-red-400/30' : 'bg-[#161b22] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}>
                  🎤
                </button>

                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={listening ? '🎤 Listening...' : 'Ask anything about DSA...'}
                    rows={1}
                    className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 resize-none transition"
                    style={{ maxHeight: '80px' }}
                  />
                </div>

                {/* Send */}
                <button onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition disabled:opacity-30 flex-shrink-0 shadow-lg shadow-cyan-400/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
