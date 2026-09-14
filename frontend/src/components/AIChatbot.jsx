import { useState, useRef, useEffect } from 'react'
import api from '../api'
import {
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Square,
  Lightbulb,
  Cpu,
  Clock,
  Code2,
  MessageSquareCode
} from 'lucide-react'

const EMOJIS = ['😊', '🤔', '💡', '🔥', '👍', '❤️', '😮', '🎯', '⚡', '🧠']

export default function AIChatbot({ problemTitle, problemDescription }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [language, setLanguage] = useState('English')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: problemTitle
        ? `👋 Hi! I'm your **CodeHub AI Assistant**!\n\nI see you're working on **"${problemTitle}"** 🎯\n\nAsk me anything — hints, approach, time complexity, or test case walkthroughs. I'm here to guide your engineering interview prep! 🚀`
        : `👋 Hi! I'm your **CodeHub AI Assistant**! 🤖\n\nI can help you with:\n• 📚 Data structures & algorithmic patterns\n• ⏱ Time & space complexity analysis\n• 💡 Step-by-step problem intuition\n• 🌳 Trees, Graphs, Dynamic Programming & more!\n\nType below or use the 🎤 mic to talk to me!`,
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
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  // ── Speech to Text ──
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is best supported in Google Chrome.')
      return
    }
    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e) => {
      setInput(e.results[0][0].transcript)
      setListening(false)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recognitionRef.current = r
    r.start()
  }

  // ── Send Message ──
  const send = async (msg) => {
    const userMsg = (msg || input).trim()
    if (!userMsg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg, feedback: null, showEmoji: false }])
    setLoading(true)
    try {
      const res = await api.post('/ai/chat', { message: userMsg, problemTitle, problemDescription, language })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: 'ai', text: reply, feedback: null, showEmoji: false }])
      speak(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ AI assistant temporarily unavailable. Please check your backend connection or Groq API token.', feedback: null, showEmoji: false }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyan-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 border border-slate-700/80 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-[11px]">$1</code>')
  }

  const quickPrompts = problemTitle ? [
    { label: 'Give me a hint', text: 'Can you give me a subtle hint without spoiling the full solution?' },
    { label: 'Optimal approach', text: 'Explain the optimal approach and intuition for this problem.' },
    { label: 'Time complexity', text: 'What is the target time and space complexity for this problem?' },
    { label: 'Edge cases', text: 'What are the critical edge cases to consider for this problem?' },
  ] : [
    { label: 'Binary Search', text: 'Explain the Binary Search pattern and when to use it.' },
    { label: 'DFS vs BFS', text: 'What is the main difference between DFS and BFS in graphs?' },
    { label: 'Dynamic Programming', text: 'How do I identify Dynamic Programming problems?' },
    { label: 'Big O Guide', text: 'Explain Big O time and space complexity with simple examples.' },
  ]

  return (
    <>
      {/* Floating Action Trigger */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false) }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer ${
          speaking
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/40 animate-pulse'
            : listening
            ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/40 animate-pulse'
            : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-cyan-500/30'
        }`}
        aria-label="Toggle CodeHub AI Assistant"
      >
        {open ? (
          <X className="w-6 h-6 text-slate-950 font-bold" />
        ) : (
          <Bot className="w-6 h-6 text-slate-950 font-bold" />
        )}
        
        {/* Active Ping Dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-[#0b0f19]"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 bg-[#0d1117] border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/70 flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
          minimized ? 'w-80 h-16' : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
        }`}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-slate-900 via-[#161b22] to-slate-900 border-b border-slate-800 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d1117]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-white text-sm font-bold truncate">CodeHub AI</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">v3.3</span>
              </div>
              <p className={`text-[11px] flex items-center gap-1 font-medium truncate ${
                speaking ? 'text-emerald-400' : listening ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {speaking ? '🔊 Audio Synthesizing...' : listening ? '🎙 Transcribing Speech...' : '✨ Context-Aware DSA Tutor'}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {speaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1.5 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg transition"
                  title="Stop audio speech"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title={minimized ? 'Expand chat' : 'Minimize chat'}
              >
                {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-start gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'
                          : 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-bold'
                      }`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      {/* Bubble */}
                      <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-sm shadow-md shadow-cyan-500/10'
                          : 'bg-[#161b22] text-slate-200 border border-slate-800 rounded-tl-sm shadow-lg'
                      }`}>
                        <div
                          className="space-y-1.5 whitespace-pre-wrap break-words"
                          dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                        />

                        {/* Reaction Display */}
                        {msg.reaction && (
                          <span className="mt-1.5 text-sm inline-block px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
                            {msg.reaction}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Row */}
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mt-1.5 ml-9">
                        <button
                          onClick={() => speak(msg.text)}
                          className="p-1 text-slate-500 hover:text-cyan-400 transition"
                          title="Read out loud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setFeedback(i, 'up')}
                          className={`p-1 transition ${msg.feedback === 'up' ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'}`}
                          title="Helpful reply"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setFeedback(i, 'down')}
                          className={`p-1 transition ${msg.feedback === 'down' ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPicker(showEmojiPicker === i ? null : i)}
                            className="text-xs text-slate-500 hover:text-amber-400 transition"
                            title="React with emoji"
                          >
                            😊
                          </button>
                          {showEmojiPicker === i && (
                            <div className="absolute bottom-6 left-0 bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-wrap gap-1.5 w-44 z-20 shadow-2xl">
                              {EMOJIS.map(e => (
                                <button
                                  key={e}
                                  onClick={() => addEmoji(i, e)}
                                  className="text-sm hover:scale-125 transition p-1"
                                >
                                  {e}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {msg.feedback === 'up' && <span className="text-[10px] text-emerald-400 font-medium">Helpful!</span>}
                        {msg.feedback === 'down' && <span className="text-[10px] text-rose-400 font-medium">Feedback recorded</span>}
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking Animation */}
                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-[#161b22] border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Analyzing algorithm</span>
                      <div className="flex gap-1">
                        {[0, 150, 300].map(d => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3.5 py-2 flex gap-1.5 overflow-x-auto border-t border-slate-800/80 flex-shrink-0 bg-slate-950/40 scrollbar-none">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p.text)}
                    className="text-[11px] text-slate-300 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-cyan-400/50 hover:text-cyan-400 transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 border-t border-slate-800 flex gap-2 items-end flex-shrink-0 bg-slate-950/60">
                <button
                  onClick={toggleListening}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                    listening
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                  title={listening ? 'Stop recording voice' : 'Dictate with microphone'}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={listening ? 'Listening to your speech...' : 'Ask about approach, complexity, hints...'}
                    rows={1}
                    className="w-full bg-[#161b22] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none transition max-h-20"
                  />
                </div>

                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-bold hover:opacity-95 transition disabled:opacity-30 flex-shrink-0 shadow-md shadow-cyan-500/20 cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
