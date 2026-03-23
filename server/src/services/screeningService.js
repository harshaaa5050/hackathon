import ScreeningResult from '../models/ScreeningResult.js'

// EPDS: Edinburgh Postnatal Depression Scale (10 questions, 0-3 each, max 30)
// PHQ-4: Patient Health Questionnaire-4 (4 questions, 0-3 each, max 12)

const classifySeverity = (type, score) => {
	if (type === 'EPDS') {
		if (score <= 8) return { severity: 'low', recommendation: 'Your score suggests low risk. Continue with self-care, breathing exercises, and positive affirmations. Stay connected with your support system.' }
		if (score <= 12) return { severity: 'moderate', recommendation: 'Your score suggests moderate risk. Consider speaking to our AI assistant for coping strategies and mindfulness exercises. Reach out to a trusted family member.' }
		return { severity: 'severe', recommendation: 'Your score suggests you may benefit from professional support. Please consider speaking to a mental health professional. If you are in crisis, call iCall (9152987821) or Vandrevala Foundation (1860-2662-345).' }
	}
	// PHQ-4
	if (score <= 2) return { severity: 'low', recommendation: 'Your score suggests low distress. Keep up your self-care routine with breathing exercises, gentle movement, and rest.' }
	if (score <= 5) return { severity: 'moderate', recommendation: 'Your score suggests moderate distress. Our AI assistant can provide coping strategies. Consider talking to someone you trust about how you feel.' }
	return { severity: 'severe', recommendation: 'Your score suggests significant distress. We recommend speaking to a professional counselor. If you are in crisis, call iCall (9152987821) or Vandrevala Foundation (1860-2662-345).' }
}

export const submitScreening = async (req, res) => {
	try {
		const { type, answers } = req.body
		const userId = req.user.id

		const score = answers.reduce((sum, a) => sum + a.answer, 0)
		const { severity, recommendation } = classifySeverity(type, score)

		const result = new ScreeningResult({
			userId,
			type,
			answers,
			score,
			severity,
			recommendation,
		})

		await result.save()
		res.status(201).json({ score, severity, recommendation, result })
	} catch (error) {
		res.status(500).json({ message: 'Error submitting screening', error: error.message })
	}
}

export const getScreeningHistory = async (req, res) => {
	try {
		const results = await ScreeningResult.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10)
		res.status(200).json(results)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching screening history', error: error.message })
	}
}
