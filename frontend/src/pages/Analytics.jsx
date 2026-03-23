import { useState, useEffect } from 'react'
import API from '@/api/axios'
import { BarChart3, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Analytics() {
  const [moodData, setMoodData] = useState([])
  const [patterns, setPatterns] = useState(null)
  const [screenings, setScreenings] = useState([])

  useEffect(() => {
    API.get('/analytics/mood?days=30').then(r => setMoodData(r.data)).catch(() => {})
    API.get('/analytics/patterns').then(r => setPatterns(r.data)).catch(() => {})
    API.get('/analytics/screenings').then(r => setScreenings(r.data)).catch(() => {})
  }, [])

  const symptomData = patterns?.symptomFrequency
    ? Object.entries(patterns.symptomFrequency).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-purple-500" />
        <h1 className="text-xl font-bold">Your Analytics</h1>
      </div>

      {/* Mood Trend Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-pink-500" /> Mood Trend (30 days)</h2>
        {moodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No mood data yet. Complete your daily check-ins to see trends.</p>
        )}
      </div>

      {/* Symptom Frequency */}
      {symptomData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4">Top Symptoms</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={symptomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats */}
      {patterns && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-pink-500">{patterns.totalCheckIns}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Check-ins</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-500">{screenings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Screenings Taken</p>
          </div>
        </div>
      )}

      {/* Screening History */}
      {screenings.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-3">Screening History</h2>
          <div className="space-y-2">
            {screenings.map(s => (
              <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <span className="text-sm font-medium">{s.type}</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{s.score}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.severity === 'low' ? 'bg-green-100 text-green-700' : s.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {s.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
