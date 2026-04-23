import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const AVATARS = ['🧑‍💻', '👩‍💻', '🦊', '🐼', '🦁', '🐯', '🦄', '🐸', '🤖', '👾']
const getAvatar = (userId) => AVATARS[userId?.charCodeAt(0) % AVATARS.length] || '🧑‍💻'
const getColor = (username) => {
  const colors = ['text-cyan-400', 'text-purple-400', 'text-green-400', 'text-yellow-400', 'text-pink-400', 'text-blue-400']
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
    axios.get(`http://localhost:5000/api/message/${problemId}`)
      .then(r => setMessages(r.data))
      .finally(() => setLoading(false))
  }, [problemId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!username) { setShowNameInput(true); return }
    setSending(true)
    try {
      const res = await axios.post('http://localhost:5000/api/message', {
        userId, username, problemId, text: text.trim()
      })
      setMessages(prev => [...prev, res.data])
      setText('')
    } catch { } finally { setSending(false) }
  }

  const saveName = () => {
    if (!nameInput.trim()) return
    localStorage.setItem('chat_username', nameInput.trim())
    setUsername(nameInput.trim())
    setShowNameInput(false)
  }

  const deleteMsg = async (id) => {
    await axios.delete(`http://localhost:5000/api/message/${id}`)
    setMessages(prev => prev.filter(m => m._id !== id))
  }

  return (
    <div className="mt-8 bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="text-white font-semibold text-sm">Discussion</h3>
          <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full">
            {messages.length}
          </span>
        </div>
        {username ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{getAvatar(userId)}</span>
            <span className={`text-xs font-semibold ${getColor(username)}`}>{username}</span>
            <button onClick={() => { setUsername(''); localStorage.removeItem('chat_username') }}
              className="text-xs text-gray-600 hover:text-gray-400 transition">change</button>
          </div>
        ) : (
          <button onClick={() => setShowNameInput(true)}
            className="text-xs text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded-lg hover:bg-cyan-400/10 transition">
            Set Username
          </button>
        )}
      </div>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="px-5 py-4 bg-[#0d1117] border-b border-gray-800">
          <p className="text-gray-400 text-xs mb-2">Choose a display name to join the discussion:</p>
          <div className="flex gap-2">
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="e.g. CodeNinja, AlgoMaster..."
              className="flex-1 bg-[#161b22] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
            />
            <button onClick={saveName}
              className="bg-cyan-400 text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyan-300 transition">
              Join
            </button>
            <button onClick={() => setShowNameInput(false)}
              className="text-gray-500 hover:text-white px-2 transition">✕</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-5 py-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm animate-pulse">Loading discussion...</div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-2">💬</span>
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-600 text-xs mt-1">Be the first to start the discussion!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className={`flex gap-3 group ${msg.userId === userId ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-gray-800 flex items-center justify-center text-sm flex-shrink-0">
              {getAvatar(msg.userId)}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.userId === userId ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold ${getColor(msg.username)}`}>{msg.username}</span>
                <span className="text-gray-600 text-xs">{timeAgo(msg.createdAt)}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.userId === userId
                  ? 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 text-white rounded-tr-sm'
                  : 'bg-[#0d1117] border border-gray-800 text-gray-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              {/* Delete own message */}
              {msg.userId === userId && (
                <button onClick={() => deleteMsg(msg._id)}
                  className="text-xs text-gray-700 hover:text-red-400 mt-1 opacity-0 group-hover:opacity-100 transition">
                  delete
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-5 py-3">
        <form onSubmit={send} className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) } }}
            placeholder={username ? "Share your approach, ask a question..." : "Set a username to comment..."}
            disabled={!username}
            rows={1}
            className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-none transition disabled:opacity-40"
          />
          <button type="submit" disabled={sending || !text.trim() || !username}
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-black hover:opacity-90 transition disabled:opacity-30 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-gray-700 text-xs mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
