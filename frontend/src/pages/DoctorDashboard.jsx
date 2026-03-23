import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { Stethoscope, CheckCircle, Clock, MessageCircle, Send, LogOut } from 'lucide-react'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [comments, setComments] = useState([])
  const [replyBody, setReplyBody] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get('/doctor/profile').then(r => setDoctor(r.data)).catch(() => navigate('/doctor/login'))
    API.get('/doctor/community').then(r => setThreads(r.data)).catch(() => {})
  }, [])

  const loadThread = async (t) => {
    setSelectedThread(t)
    const res = await API.get(`/community/threads/${t._id}/comments`)
    setComments(res.data)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyBody.trim()) return
    setLoading(true)
    try {
      await API.post(`/doctor/community/${selectedThread._id}/comment`, { body: replyBody })
      setReplyBody('')
      const res = await API.get(`/community/threads/${selectedThread._id}/comments`)
      setComments(res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'
    navigate('/doctor/login')
  }

  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Dr. {doctor.name}</h1>
            <p className="text-sm opacity-90">{doctor.specialization} · {doctor.experience} yrs exp.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {doctor.isVerified ? (
              <><CheckCircle className="h-4 w-4" /><span className="text-sm">Verified</span></>
            ) : (
              <><Clock className="h-4 w-4" /><span className="text-sm">Pending Verification</span></>
            )}
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/20"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>

      {!doctor.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          ⏳ Your profile is pending verification. Once approved, you will have full access to patient interactions and community features.
        </div>
      )}

      {/* Community Threads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Community Questions</h2>
          {threads.map(t => (
            <button key={t._id} onClick={() => loadThread(t)}
              className={`w-full text-left bg-card border rounded-2xl p-4 transition-all ${selectedThread?._id === t._id ? 'border-blue-500 shadow-md' : 'border-border hover:border-blue-300'}`}>
              <h3 className="font-semibold text-sm line-clamp-1">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.body}</p>
              <span className="text-xs text-muted-foreground mt-1 inline-block">{t.commentCount || 0} comments</span>
            </button>
          ))}
        </div>

        {/* Thread Detail + Reply */}
        {selectedThread && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold">{selectedThread.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selectedThread.body}</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {comments.map(c => (
                <div key={c._id} className="bg-muted/50 rounded-xl p-3">
                  <span className="text-xs font-semibold">
                    {c.doctorId ? `Dr. ${c.doctorId.name}` : (c.authorId?.name || 'Anonymous')}
                  </span>
                  {c.doctorId && <span className="text-xs ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">Doctor</span>}
                  <p className="text-sm mt-1">{c.body}</p>
                </div>
              ))}
            </div>

            {doctor.isVerified && (
              <form onSubmit={handleReply} className="flex gap-2">
                <input value={replyBody} onChange={e => setReplyBody(e.target.value)} placeholder="Reply as doctor..."
                  className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                <button type="submit" disabled={loading}
                  className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm disabled:opacity-50">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
