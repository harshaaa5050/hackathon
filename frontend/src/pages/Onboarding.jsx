import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import API from '@/api/axios'
import { Heart, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const LIFE_STAGES = [
  { value: 'pregnancy', label: '🤰 Pregnancy', desc: 'Currently expecting' },
  { value: 'postpartum', label: '👶 Postpartum', desc: 'Recently gave birth' },
  { value: 'miscarriage', label: '💔 Miscarriage / Loss', desc: 'Experienced a loss' },
  { value: 'menopause', label: '🌸 Menopause', desc: 'Going through menopause' },
]

const CULTURAL_QUESTIONS = [
  { key: 'livingArrangement', question: 'What is your current living arrangement?', options: ['Joint family', 'Nuclear family', 'Living alone', 'With in-laws', 'With parents'] },
  { key: 'supportSystem', question: 'How would you describe your support system at home?', options: ['Very supportive', 'Somewhat supportive', 'Limited support', 'No support', 'Prefer not to say'] },
  { key: 'workStatus', question: 'What is your current work status?', options: ['Working full-time', 'Working part-time', 'Homemaker', 'On leave', 'Self-employed', 'Student'] },
  { key: 'householdPressure', question: 'Do you feel household or family pressure?', options: ['None', 'A little', 'Moderate', 'Significant', 'Overwhelming'] },
  { key: 'partnerInvolvement', question: 'How involved is your partner/family in your well-being?', options: ['Very involved', 'Somewhat involved', 'Rarely involved', 'Not involved', 'Not applicable'] },
]

const LIFE_STAGE_QUESTIONS = {
  pregnancy: [
    { key: 'trimester', q: 'Which trimester are you in?', options: ['First (1-12 weeks)', 'Second (13-26 weeks)', 'Third (27-40 weeks)'] },
    { key: 'firstPregnancy', q: 'Is this your first pregnancy?', options: ['Yes', 'No'] },
    { key: 'complications', q: 'Have you had any pregnancy complications?', options: ['None', 'Minor', 'Significant', 'Prefer not to say'] },
  ],
  postpartum: [
    { key: 'babyAge', q: 'How old is your baby?', options: ['0-3 months', '3-6 months', '6-12 months', '1-2 years'] },
    { key: 'feedingMethod', q: 'How are you feeding your baby?', options: ['Breastfeeding', 'Formula', 'Both', 'Other'] },
    { key: 'sleepQuality', q: 'How is your sleep since delivery?', options: ['Very poor', 'Poor', 'Fair', 'Good'] },
  ],
  miscarriage: [
    { key: 'timeframe', q: 'When did the loss occur?', options: ['Less than 1 month ago', '1-3 months ago', '3-6 months ago', 'Over 6 months ago'] },
    { key: 'counselingHistory', q: 'Have you received any counseling?', options: ['Yes', 'No', 'Planning to'] },
    { key: 'tryingAgain', q: 'Are you planning to try again?', options: ['Yes', 'Not sure', 'No', 'Prefer not to say'] },
  ],
  menopause: [
    { key: 'stage', q: 'What stage are you in?', options: ['Perimenopause', 'Menopause', 'Postmenopause', 'Not sure'] },
    { key: 'symptoms', q: 'What symptoms trouble you most?', options: ['Hot flashes', 'Mood swings', 'Sleep issues', 'Weight changes', 'All of the above'] },
    { key: 'hrt', q: 'Are you on hormone replacement therapy?', options: ['Yes', 'No', 'Considering it'] },
  ],
}

// EPDS questions for pregnant/postpartum
const EPDS_QUESTIONS = [
  { q: 'I have been able to laugh and see the funny side of things', opts: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
  { q: 'I have looked forward with enjoyment to things', opts: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'] },
  { q: 'I have blamed myself unnecessarily when things went wrong', opts: ['No, never', 'Not very often', 'Yes, some of the time', 'Yes, most of the time'] },
  { q: 'I have been anxious or worried for no good reason', opts: ['No, not at all', 'Hardly ever', 'Yes, sometimes', 'Yes, very often'] },
  { q: 'I have felt scared or panicky for no good reason', opts: ['No, not at all', 'No, not much', 'Yes, sometimes', 'Yes, quite a lot'] },
  { q: 'Things have been getting on top of me', opts: ['No, I have been coping', 'No, most of the time I cope', 'Yes, sometimes I can\'t cope', 'Yes, most of the time I can\'t cope'] },
  { q: 'I have been so unhappy that I have had difficulty sleeping', opts: ['No, not at all', 'Not very often', 'Yes, sometimes', 'Yes, most of the time'] },
  { q: 'I have felt sad or miserable', opts: ['No, not at all', 'Not very often', 'Yes, quite often', 'Yes, most of the time'] },
  { q: 'I have been so unhappy that I have been crying', opts: ['No, never', 'Only occasionally', 'Yes, quite often', 'Yes, most of the time'] },
  { q: 'The thought of harming myself has occurred to me', opts: ['Never', 'Hardly ever', 'Sometimes', 'Yes, quite often'] },
]

// PHQ-4 questions for miscarriage/menopause
const PHQ4_QUESTIONS = [
  { q: 'Feeling nervous, anxious, or on edge', opts: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Not being able to stop or control worrying', opts: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Little interest or pleasure in doing things', opts: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Feeling down, depressed, or hopeless', opts: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
]

export default function Onboarding() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0-age, 1-lifeStage, 2-cultural, 3-lifeStageQs, 4-screening, 5-results
  const [age, setAge] = useState('')
  const [lifeStage, setLifeStage] = useState('')
  const [culturalContext, setCulturalContext] = useState({})
  const [lifeStageAnswers, setLifeStageAnswers] = useState({})
  const [screeningAnswers, setScreeningAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [culturalStep, setCulturalStep] = useState(0)

  const screeningQuestions = ['pregnancy', 'postpartum'].includes(lifeStage) ? EPDS_QUESTIONS : PHQ4_QUESTIONS
  const screeningType = ['pregnancy', 'postpartum'].includes(lifeStage) ? 'EPDS' : 'PHQ4'

  const handleSaveOnboarding = async () => {
    setLoading(true)
    try {
      await API.post('/onboarding', { age: Number(age), lifeStage, culturalContext, lifeStageAnswers })
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleSubmitScreening = async () => {
    setLoading(true)
    try {
      const res = await API.post('/screening', {
        type: screeningType,
        answers: screeningAnswers.map((a, i) => ({ questionIndex: i, answer: a })),
      })
      setResult(res.data)
      await refreshUser()
      setStep(5)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const Tile = ({ selected, onClick, children, className = '' }) => (
    <button onClick={onClick}
      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${selected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-border bg-card hover:border-pink-300'} ${className}`}>
      {children}
    </button>
  )

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {[0,1,2,3,4].map(i => (
        <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i <= step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-muted'}`} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-background to-purple-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <Heart className="h-6 w-6 text-pink-500 fill-pink-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Let&apos;s Get to Know You</h1>
          <p className="text-sm text-muted-foreground mt-1">This helps us personalise your experience</p>
        </div>

        <StepIndicator />

        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 min-h-[300px]">

          {/* Step 0: Age */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">How old are you?</h2>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min={13} max={100}
                placeholder="Enter your age" className="w-full h-12 px-4 rounded-xl border border-input bg-background text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
              <button onClick={() => age && setStep(1)} disabled={!age}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1: Life Stage */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">What stage of life are you in?</h2>
              <div className="grid grid-cols-1 gap-3">
                {LIFE_STAGES.map(s => (
                  <Tile key={s.value} selected={lifeStage === s.value} onClick={() => setLifeStage(s.value)}>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                  </Tile>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => lifeStage && setStep(2)} disabled={!lifeStage}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Cultural Context */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{CULTURAL_QUESTIONS[culturalStep].question}</h2>
              <p className="text-xs text-muted-foreground">Question {culturalStep + 1} of {CULTURAL_QUESTIONS.length}</p>
              <div className="space-y-2">
                {CULTURAL_QUESTIONS[culturalStep].options.map(opt => (
                  <Tile key={opt} selected={culturalContext[CULTURAL_QUESTIONS[culturalStep].key] === opt}
                    onClick={() => setCulturalContext({ ...culturalContext, [CULTURAL_QUESTIONS[culturalStep].key]: opt })} className="w-full">
                    {opt}
                  </Tile>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => culturalStep > 0 ? setCulturalStep(culturalStep - 1) : setStep(1)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => {
                  if (culturalStep < CULTURAL_QUESTIONS.length - 1) setCulturalStep(culturalStep + 1)
                  else setStep(3)
                }} disabled={!culturalContext[CULTURAL_QUESTIONS[culturalStep].key]}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {culturalStep < CULTURAL_QUESTIONS.length - 1 ? 'Next' : 'Continue'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Life Stage Specific */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">A few more questions about your {lifeStage}</h2>
              {LIFE_STAGE_QUESTIONS[lifeStage]?.map(lq => (
                <div key={lq.key} className="space-y-2">
                  <p className="text-sm font-medium">{lq.q}</p>
                  <div className="flex flex-wrap gap-2">
                    {lq.options.map(opt => (
                      <button key={opt} onClick={() => setLifeStageAnswers({ ...lifeStageAnswers, [lq.key]: opt })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${lifeStageAnswers[lq.key] === opt ? 'bg-pink-500 text-white border-pink-500' : 'border-border hover:border-pink-300'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={async () => { await handleSaveOnboarding(); setStep(4) }} disabled={loading}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? 'Saving...' : 'Continue to Screening'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Screening */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{screeningType === 'EPDS' ? 'Edinburgh Postnatal Depression Scale' : 'PHQ-4 Screening'}</h2>
              <p className="text-xs text-muted-foreground">Over the past 2 weeks, how often have you been bothered by the following?</p>
              {screeningQuestions.map((sq, qi) => (
                <div key={qi} className="space-y-2 pb-3 border-b border-border last:border-0">
                  <p className="text-sm font-medium">{qi + 1}. {sq.q}</p>
                  <div className="space-y-1">
                    {sq.opts.map((opt, oi) => (
                      <button key={oi} onClick={() => {
                        const copy = [...screeningAnswers]
                        copy[qi] = oi
                        setScreeningAnswers(copy)
                      }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${screeningAnswers[qi] === oi ? 'bg-pink-500 text-white' : 'bg-muted/50 hover:bg-muted'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmitScreening}
                disabled={loading || screeningAnswers.filter(a => a !== undefined).length < screeningQuestions.length}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Screening'}
              </button>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && result && (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">Onboarding Complete!</h2>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${result.severity === 'low' ? 'bg-green-100 text-green-700' : result.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                Severity: {result.severity}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
              <button onClick={() => navigate('/dashboard')}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm flex items-center justify-center gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
