import { useState, useEffect, useRef } from 'react'
import api from '../api'
import {
  MessageSquare,
  Send,
  User,
  Trash2,
  Sparkles,
  Edit3,
  X,
  Check,
  MessageCircle,
  Clock
} from 'lucide-react'

const AVATARS = ['🧑‍💻', '👩‍💻', '🦊', '🐼', '🦁', '🐯', '🦄', '🐸', '🤖', '👾']
const getAvatar = (userId) => AVATARS[userId?.charCodeAt(0) % AVATARS.length] || '🧑‍💻'
const getColor = (username) => {
  const colors = ['text-cyan-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-pink-400', 'text-blue-400']
  return colors[(username?.charCodeAt(0) || 0) % colors.length]
}

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Discussion({ problemId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [username, setUsername] = useState(() => localStorage.getItem('chat_username') || '')
  const [showNameInput, setShowNameInput] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const bottomRef = useRef(null)

  const userId = username || 'anonymous'

  useEffect(() => {
    if (!problemId) return
    api.get(`/api/message/${problemId}`)
      .then(r => setMessages(r.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [problemId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!username) {
      setShowNameInput(true)
      return
    }
    setSending(true)
    try {
      const res = await api.post('/api/message', {
        userId,
        username,
        problemId,
        text: text.trim()
      })
      setMessages(prev => [...prev, res.data])
      setText('')
    } catch (err) {
      console.error('Discussion send error:', err)
    } finally {
      setSending(false)
    }
  }

  const saveName = () => {
    if (!nameInput.trim()) return
    localStorage.setItem('chat_username', nameInput.trim())
    setUsername(nameInput.trim())
    setShowNameInput(false)
  }

  const deleteMsg = async (id) => {
    try {
      await api.delete(`/api/message/${id}`)
      setMessages(prev => prev.filter(m => m._id !== id))
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  return (
    <div className="bg-[#161b22]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Community Discussion</h3>
            <p className="text-[11px] text-slate-400">Share intuitions, optimizations, and questions</p>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full ml-1">
            {messages.length}
          </span>
        </div>

        {username ? (
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-sm">{getAvatar(userId)}</span>
            <span className={`text-xs font-semibold ${getColor(username)}`}>{username}</span>
            <button
              onClick={() => { setUsername(''); localStorage.removeItem('chat_username'); setShowNameInput(true) }}
              className="text-slate-500 hover:text-slate-300 p-0.5 transition"
              title="Change handle"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNameInput(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl hover:bg-cyan-500/20 transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Set Handle</span>
          </button>
        )}
      </div>

      {/* Name Input Bar */}
      {showNameInput && (
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 animate-fadeIn">
          <p className="text-slate-400 text-xs mb-2">Choose a developer handle to participate in this discussion:</p>
          <div className="flex gap-2">
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="e.g. AlgoMaster, DevNinja..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={saveName}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:opacity-95 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Join</span>
            </button>
            <button
              onClick={() => setShowNameInput(false)}
              className="text-slate-500 hover:text-white p-2 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="h-72 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-slate-500 text-xs">Loading thread...</div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-sm font-semibold">No comments posted yet</p>
            <p className="text-slate-500 text-xs mt-1">Be the first developer to share your insight or solution approach!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className={`flex gap-3 group ${msg.userId === userId ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm flex-shrink-0">
              {getAvatar(msg.userId)}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] ${msg.userId === userId ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold ${getColor(msg.username)}`}>{msg.username}</span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{timeAgo(msg.createdAt)}</span>
                </span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.userId === userId
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white rounded-tr-sm'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              {/* Delete own message */}
              {msg.userId === userId && (
                <button
                  onClick={() => deleteMsg(msg._id)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 mt-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/60">
        <form onSubmit={send} className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) } }}
            placeholder={username ? "Share your approach, complexity insight, or question..." : "Click 'Set Handle' above to join this discussion..."}
            disabled={!username}
            rows={1}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none transition disabled:opacity-40 max-h-24"
          />
          <button
            type="submit"
            disabled={sending || !text.trim() || !username}
            className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-bold hover:opacity-95 transition disabled:opacity-30 flex-shrink-0 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
        <p className="text-slate-500 text-[10px] mt-2">
          Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Enter</kbd> to submit · <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Shift + Enter</kbd> for line break
        </p>
      </div>
    </div>
  )
}
