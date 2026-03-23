import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/api/axios'
import { Heart, Send } from 'lucide-react'

const SYMPTOMS = [
  'Headache', 'Fatigue', 'Nausea', 'Back pain', 'Insomnia',
  'Crying spells', 'Irritability', 'Loss of appetite', 'Anxiety',
  'Hot flashes', 'Brain fog', 'Body ache', 'Mood swings',
]

export default function DailyCheckIn() {
  const navigate = useNavigate()
  const [mood, setMood] = useState(5)
  const [symptoms, setSymptoms] = useState([])
  const [sleepQuality, setSleepQuality] = useState('')
  const [anxietyLevel, setAnxietyLevel] = useState('')
  const [appetite, setAppetite] = useState('')
  const [energyLevel, setEnergyLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await API.post('/checkin', { mood, symptoms, sleepQuality, anxietyLevel, appetite, energyLevel, notes })
      setDone(true)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const PillGroup = ({ label, options, value, onChange }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${value === o.value ? 'bg-pink-500 text-white border-pink-500' : 'border-border hover:border-pink-300'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
        <div className="text-5xl">🌸</div>
        <h2 className="text-xl font-bold">Check-in Complete!</h2>
        <p className="text-sm text-muted-foreground">Thank you for taking a moment for yourself. Your mood: {mood}/10</p>
        <button onClick={() => navigate('/dashboard')}
          className="h-10 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const moodEmoji = mood <= 2 ? '😢' : mood <= 4 ? '😔' : mood <= 6 ? '😐' : mood <= 8 ? '🙂' : '😊'

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <Heart className="h-6 w-6 text-pink-500 fill-pink-500 mx-auto mb-2" />
        <h1 className="text-xl font-bold">How are you feeling today?</h1>
        <p className="text-xs text-muted-foreground mt-1">Take a moment to check in with yourself</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-6">
        {/* Mood Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Mood</label>
          <div className="text-center text-4xl">{moodEmoji}</div>
          <input type="range" min={1} max={10} value={mood} onChange={e => setMood(Number(e.target.value))}
            className="w-full accent-pink-500" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Very Low</span><span className="font-semibold text-foreground">{mood}/10</span><span>Excellent</span>
          </div>
        </div>

        {/* Symptoms */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Any symptoms today?</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button key={s} onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${symptoms.includes(s) ? 'bg-pink-500 text-white border-pink-500' : 'border-border hover:border-pink-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quick cards */}
        <PillGroup label="How did you sleep?" options={[
          { value: 'poor', label: '😞 Poor' }, { value: 'fair', label: '😐 Fair' },
          { value: 'good', label: '😊 Good' }, { value: 'excellent', label: '🤩 Excellent' },
        ]} value={sleepQuality} onChange={setSleepQuality} />

        <PillGroup label="Anxiety level?" options={[
          { value: 'none', label: 'None' }, { value: 'mild', label: 'Mild' },
          { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' },
        ]} value={anxietyLevel} onChange={setAnxietyLevel} />

        <PillGroup label="Appetite?" options={[
          { value: 'poor', label: 'Poor' }, { value: 'normal', label: 'Normal' }, { value: 'good', label: 'Good' },
        ]} value={appetite} onChange={setAppetite} />

        <PillGroup label="Energy level?" options={[
          { value: 'low', label: '🔋Low' }, { value: 'moderate', label: '🔋Moderate' }, { value: 'high', label: '🔋High' },
        ]} value={energyLevel} onChange={setEnergyLevel} />

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Anything else on your mind? (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Write anything you want to share..."
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none" />
        </div>

        <button onClick={handleSubmit} disabled={loading || !sleepQuality}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
          <Send className="h-4 w-4" /> {loading ? 'Saving...' : 'Submit Check-in'}
        </button>
      </div>
    </div>
  )
}
