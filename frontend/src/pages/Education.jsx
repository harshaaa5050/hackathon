import { useAuth } from '@/context/AuthContext'
import { BookOpen, Heart } from 'lucide-react'

const CONTENT = {
  pregnancy: {
    title: 'Pregnancy Wellness',
    emoji: '🤰',
    sections: [
      { title: 'Emotional Changes Are Normal', body: 'During pregnancy your body goes through immense hormonal shifts. It is completely normal to feel mood swings, anxiety, or overwhelm. You are not alone in this, and these feelings do not make you a bad mother.' },
      { title: 'Nutrition & Rest', body: 'Eat small, frequent meals. Include iron-rich foods like spinach, jaggery, and dates. Stay hydrated and rest when your body asks for it. There is no shame in asking family for help with chores.' },
      { title: 'Gentle Movement', body: 'Light walks, prenatal yoga, and deep breathing exercises can help reduce anxiety and improve sleep. Always consult your doctor before starting any exercise routine.' },
      { title: 'Building Your Support Circle', body: 'Talk to your partner, mother, or a trusted friend about what you are feeling. If family pressure feels overwhelming, it is okay to set boundaries. Your mental health matters as much as your physical health.' },
      { title: 'When to Seek Help', body: 'If you feel persistent sadness, loss of interest, thoughts of self-harm, or inability to function for more than two weeks, please reach out to a mental health professional. Helplines: iCall (9152987821), Vandrevala Foundation (1860-2662-345).' },
    ],
  },
  postpartum: {
    title: 'Postpartum Recovery',
    emoji: '👶',
    sections: [
      { title: 'Baby Blues vs Postpartum Depression', body: 'Baby blues (mood swings, crying, anxiety) are common in the first 2 weeks after delivery. If these feelings last longer, intensify, or make it hard to care for your baby or yourself, it may be postpartum depression — and it is treatable.' },
      { title: 'Sleep When You Can', body: 'Sleep deprivation can worsen mood. Try to rest when the baby sleeps. Ask your partner or family to share night feeds if possible. You do not have to do everything alone.' },
      { title: 'Bonding Takes Time', body: 'If you do not feel an instant bond with your baby, that is more common than you think. Bonding grows with time, skin-to-skin contact, and small daily moments. Be gentle with yourself.' },
      { title: 'Nutrition for Recovery', body: 'Focus on protein, iron, and calcium-rich foods. Traditional foods like dal, ghee, rice, and dry fruits can be nourishing. Stay hydrated, especially if breastfeeding.' },
      { title: 'It Is Okay to Ask for Help', body: 'Whether it is from your husband, mother, in-laws, or a professional — asking for help is strength, not weakness. Your well-being directly affects your baby\'s well-being.' },
    ],
  },
  miscarriage: {
    title: 'Healing After Loss',
    emoji: '💔',
    sections: [
      { title: 'Your Grief Is Valid', body: 'A miscarriage is a real loss, regardless of how early it happened. You have every right to grieve. There is no "right" way to mourn — give yourself permission to feel whatever comes up.' },
      { title: 'It Was Not Your Fault', body: 'Miscarriages are most often caused by chromosomal abnormalities or medical factors beyond your control. It was not caused by something you ate, a thought you had, or work you did. Please do not blame yourself.' },
      { title: 'Physical Recovery', body: 'Allow your body to heal. Follow your doctor\'s advice on rest and medication. Eat nourishing foods and stay hydrated. Light activity like walks can help when you feel ready.' },
      { title: 'Dealing with Social Pressure', body: 'In Indian families, pregnancy loss is often not discussed openly, which can make you feel isolated. You do not owe anyone an explanation. Confide in people who make you feel safe.' },
      { title: 'Moving Forward', body: 'Healing is not linear. Some days will be harder than others. When you are ready, talk to your doctor about trying again if you wish. There is no rush — your timeline is your own.' },
    ],
  },
  menopause: {
    title: 'Navigating Menopause',
    emoji: '🌸',
    sections: [
      { title: 'Understanding What\'s Happening', body: 'Menopause is a natural transition, not a disease. As estrogen levels change, you may experience hot flashes, mood swings, sleep disturbances, and changes in energy. These are temporary and manageable.' },
      { title: 'Managing Hot Flashes', body: 'Wear breathable fabrics, keep your room cool, and avoid spicy food and caffeine before bed. Deep breathing exercises during a hot flash can help reduce its intensity.' },
      { title: 'Mood and Mental Health', body: 'Hormonal changes can trigger anxiety, irritability, or low mood. Regular exercise, meditation, and maintaining social connections can make a significant difference. Do not dismiss these feelings.' },
      { title: 'Bone and Heart Health', body: 'Post-menopause, the risk of osteoporosis and heart disease increases. Include calcium-rich foods (milk, ragi, green vegetables), vitamin D (sunlight), and regular weight-bearing exercise in your routine.' },
      { title: 'Talking to Your Doctor', body: 'If symptoms significantly affect your quality of life, discuss hormone replacement therapy (HRT) or other treatments with your gynaecologist. There are effective options available.' },
    ],
  },
}

export default function Education() {
  const { user } = useAuth()
  const stage = user?.lifeStage || 'pregnancy'
  const content = CONTENT[stage]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-green-500" />
        <h1 className="text-xl font-bold">{content.title}</h1>
        <span className="text-2xl">{content.emoji}</span>
      </div>

      <div className="space-y-4">
        {content.sections.map((s, i) => (
          <details key={i} className="bg-card border border-border rounded-2xl overflow-hidden group" open={i === 0}>
            <summary className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-accent/50 transition-colors">
              <span className="font-semibold text-sm">{s.title}</span>
              <Heart className="h-4 w-4 text-pink-400 group-open:fill-pink-400 transition-all" />
            </summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{s.body}</div>
          </details>
        ))}
      </div>

      {/* Life stage selector */}
      <div className="bg-muted/50 rounded-2xl p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Browse other stages:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CONTENT).map(([key, val]) => (
            <span key={key} className={`px-3 py-1.5 rounded-full text-xs font-medium ${key === stage ? 'bg-pink-500 text-white' : 'bg-card border border-border'}`}>
              {val.emoji} {val.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
