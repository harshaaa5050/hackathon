import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '@/api/axios'
import { ArrowLeft, Send } from 'lucide-react'

export default function CommunityThread() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get(`/community/threads/${id}`).then(r => setThread(r.data)).catch(() => {})
    fetchComments()
  }, [id])

  const fetchComments = () => {
    API.get(`/community/threads/${id}/comments`).then(r => setComments(r.data)).catch(() => {})
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    try {
      await API.post(`/community/threads/${id}/comments`, { body, isAnonymous })
      setBody('')
      setIsAnonymous(false)
      fetchComments()
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (!thread) return <div className="p-8 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Link to="/community" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Community
      </Link>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h1 className="text-lg font-bold">{thread.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">by {thread.authorId?.name || 'Anonymous'} · {new Date(thread.createdAt).toLocaleDateString('en-IN')}</p>
        {thread.tags?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {thread.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">{t}</span>)}
          </div>
        )}
        <p className="text-sm mt-4 leading-relaxed whitespace-pre-wrap">{thread.body}</p>
      </div>

      {/* Comments */}
      <h2 className="text-sm font-semibold">Comments ({comments.length})</h2>
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c._id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold">
                {c.doctorId ? `Dr. ${c.doctorId.name} (${c.doctorId.specialization})` : (c.authorId?.name || 'Anonymous')}
              </span>
              {c.doctorId && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Doctor</span>}
              <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <p className="text-sm leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleComment} className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Share your thoughts..."
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="accent-pink-500" />
            Anonymous
          </label>
          <button type="submit" disabled={loading || !body.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium disabled:opacity-50">
            <Send className="h-3.5 w-3.5" /> {loading ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}
