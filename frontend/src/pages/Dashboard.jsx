import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'
import API from '@/api/axios'
import { Heart, Brain, MessageCircle, Users, BarChart3, FileDown, Sun, Stethoscope, BookOpen } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [todayCheckIn, setTodayCheckIn] = useState(null)
  const [recentMood, setRecentMood] = useState([])
  const [latestScreening, setLatestScreening] = useState(null)

  useEffect(() => {
    API.get('/checkin/today').then(r => setTodayCheckIn(r.data)).catch(() => {})
    API.get('/checkin/recent').then(r => setRecentMood(r.data.slice(0, 7))).catch(() => {})
    API.get('/screening/history').then(r => { if (r.data.length) setLatestScreening(r.data[0]) }).catch(() => {})
  }, [])

  const avgMood = recentMood.length ? (recentMood.reduce((s, c) => s + c.mood, 0) / recentMood.length).toFixed(1) : null

  const Card = ({ icon: Icon, title, desc, to, color, children }) => (
    <Link to={to} className="group block bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-pink-200 transition-all">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm group-hover:text-pink-600 transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          {children}
        </div>
      </div>
    </Link>
  )

  const handlePDF = async () => {
    try {
      const res = await API.get('/pdf/report', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'MatriAI-Report.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="h-5 w-5" />
          <span className="text-sm font-medium opacity-90">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <h1 className="text-2xl font-bold">Hello, {user?.name?.split(' ')[0]} 💜</h1>
        <p className="text-sm opacity-90 mt-1">
          {user?.lifeStage === 'pregnancy' ? 'Wishing you a peaceful day, mama-to-be!' :
           user?.lifeStage === 'postpartum' ? 'You\'re doing an amazing job, new mama!' :
           user?.lifeStage === 'miscarriage' ? 'Sending you gentle strength today.' :
           'Wishing you comfort and calm today.'}
        </p>
        {avgMood && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm">
            <Heart className="h-3.5 w-3.5" /> Weekly mood avg: {avgMood}/10
          </div>
        )}
      </div>

      {/* Daily Check-in Banner */}
      {!todayCheckIn?.completed && (
        <Link to="/checkin" className="block bg-yellow-50 border border-yellow-200 rounded-2xl p-4 hover:bg-yellow-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-200 rounded-xl"><Heart className="h-5 w-5 text-yellow-700" /></div>
            <div>
              <h3 className="font-semibold text-sm text-yellow-800">Daily Check-in</h3>
              <p className="text-xs text-yellow-600">You haven&apos;t checked in today. How are you feeling?</p>
            </div>
          </div>
        </Link>
      )}
      {todayCheckIn?.completed && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-200 rounded-xl"><Heart className="h-5 w-5 text-green-700" /></div>
            <div>
              <h3 className="font-semibold text-sm text-green-800">Check-in Done ✓</h3>
              <p className="text-xs text-green-600">Mood: {todayCheckIn.checkIn?.mood}/10 — Great job taking a moment for yourself!</p>
            </div>
          </div>
        </div>
      )}

      {/* Screening Summary */}
      {latestScreening && (
        <div className={`rounded-2xl p-4 border ${latestScreening.severity === 'low' ? 'bg-green-50 border-green-200' : latestScreening.severity === 'moderate' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className="font-semibold text-sm mb-1">Latest Screening: {latestScreening.type}</h3>
          <p className="text-xs">Score: {latestScreening.score} — <span className="font-semibold capitalize">{latestScreening.severity}</span></p>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card icon={Brain} title="AI Chat Support" desc="Talk to your compassionate companion" to="/chat" color="bg-purple-100 text-purple-600" />
        <Card icon={BarChart3} title="Analytics" desc="Track your mood trends and patterns" to="/analytics" color="bg-blue-100 text-blue-600" />
        <Card icon={Users} title="Community" desc="Connect with others on a similar journey" to="/community" color="bg-pink-100 text-pink-600" />
        <Card icon={BookOpen} title="Education" desc="Learn about your life stage" to="/education" color="bg-green-100 text-green-600" />
        <Card icon={MessageCircle} title="Daily Check-in" desc="Record how you're feeling today" to="/checkin" color="bg-yellow-100 text-yellow-600" />
        <Card icon={Stethoscope} title="Find a Doctor" desc="Connect with verified professionals" to="/community" color="bg-teal-100 text-teal-600" />
      </div>

      {/* PDF Export */}
      <button onClick={handlePDF}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
        <FileDown className="h-4 w-4" /> Download Health Report (PDF)
      </button>
    </div>
  )
}
