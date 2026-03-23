import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { Search, Plus, MessageCircle, Tag } from 'lucide-react'

export default function Community() {
  const navigate = useNavigate()
  const [threads, setThreads] = useState([])
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newThread, setNewThread] = useState({ title: '', body: '', tags: '', isAnonymous: false })
  const [loading, setLoading] = useState(false)

  const fetchThreads = () => {
    API.get('/community/threads').then(r => setThreads(r.data)).catch(() => {})
  }

  useEffect(() => { fetchThreads() }, [])

  const handleSearch = async () => {
    if (!search.trim()) return fetchThreads()
    const res = await API.get(`/community/threads/search?q=${encodeURIComponent(search)}`)
    setThreads(res.data)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = { ...newThread, tags: newThread.tags.split(',').map(t => t.trim()).filter(Boolean) }
      await API.post('/community/threads', data)
      setShowCreate(false)
      setNewThread({ title: '', body: '', tags: '', isAnonymous: false })
      fetchThreads()
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Community</h1>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search threads..." className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
        </div>
        <button onClick={handleSearch} className="px-4 rounded-xl border border-border text-sm font-medium hover:bg-accent">Search</button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-card rounded-2xl border border-border p-5 space-y-3">
          <input value={newThread.title} onChange={e => setNewThread({ ...newThread, title: e.target.value })} required
            placeholder="Title" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
          <textarea value={newThread.body} onChange={e => setNewThread({ ...newThread, body: e.target.value })} required rows={4}
            placeholder="Share your thoughts..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
          <input value={newThread.tags} onChange={e => setNewThread({ ...newThread, tags: e.target.value })}
            placeholder="Tags (comma separated)" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newThread.isAnonymous} onChange={e => setNewThread({ ...newThread, isAnonymous: e.target.checked })}
              className="rounded accent-pink-500" />
            Post anonymously
          </label>
          <button type="submit" disabled={loading}
            className="w-full h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium disabled:opacity-50">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      {/* Thread List */}
      <div className="space-y-3">
        {threads.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No threads yet. Be the first to post!</p>}
        {threads.map(t => (
          <Link key={t._id} to={`/community/${t._id}`}
            className="block bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-pink-200 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{t.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">{t.authorId?.name || 'Anonymous'}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {t.commentCount || 0}
                  </span>
                  {t.tags?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {t.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
