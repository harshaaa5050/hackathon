import { useState, useEffect, useRef } from 'react'
import API from '@/api/axios'
import { Send, Bot, User, AlertTriangle, Plus } from 'lucide-react'

export default function Chat() {
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    API.get('/chat/history').then(r => setSessions(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSession = async (sid) => {
    const res = await API.get(`/chat/session/${sid}`)
    setSessionId(sid)
    setMessages(res.data.messages || [])
  }

  const startNewChat = () => {
    setSessionId(null)
    setMessages([])
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await API.post('/chat/send', { message: userMsg, sessionId })
      setSessionId(res.data.sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response, isCrisis: res.data.isCrisis }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-3.5rem)] flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-muted/30 p-3">
        <button onClick={startNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white mb-3">
          <Plus className="h-4 w-4" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map(s => (
            <button key={s._id} onClick={() => loadSession(s._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-colors ${sessionId === s._id ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              {s.messages?.[0]?.content?.slice(0, 40) || 'Chat session'}...
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-pink-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold">MatriAI Chat</h2>
              <p className="text-sm text-muted-foreground mt-1">Your supportive, culturally aware companion.<br />Share what&apos;s on your mind — I&apos;m here to listen.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md'
                : m.isCrisis ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-md' : 'bg-muted rounded-bl-md'}`}>
                {m.isCrisis && <AlertTriangle className="h-4 w-4 text-red-500 mb-1" />}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..." disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
