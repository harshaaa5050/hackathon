import ChatSession from '../models/ChatSession.js'
import User from '../models/User.js'
import DailyCheckIn from '../models/DailyCheckIn.js'
import ScreeningResult from '../models/ScreeningResult.js'
import env from '../config/env.js'

const CRISIS_KEYWORDS = [
	'suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live',
	'self harm', 'self-harm', 'cut myself', 'hurt myself', 'overdose',
	'marna chahti', 'mar jaungi', 'jeene ka mann nahi',
]

const CRISIS_RESPONSE = {
	role: 'assistant',
	content: `🚨 I can sense you may be going through an extremely difficult time. Your feelings are valid, and you are not alone.

**Please reach out to a crisis helpline immediately:**
- **iCall:** 9152987821
- **Vandrevala Foundation:** 1860-2662-345 (24/7)
- **AASRA:** 9820466726

You deserve support. A trained counselor can help you right now. Please do not hesitate to call.

If you are in immediate danger, please contact emergency services (112) or go to your nearest hospital.`
}

const buildSystemPrompt = (user, recentCheckIns, latestScreening) => {
	let prompt = `You are MatriAI, a warm, supportive, and culturally aware mental health companion for Indian women. You speak gently, use simple language, and are sensitive to Indian cultural contexts like family dynamics, societal expectations, and cultural stigma around mental health.

**User Context:**
- Name: ${user.name}
- Age: ${user.age || 'Not specified'}
- Life Stage: ${user.lifeStage || 'Not specified'}
`

	if (user.culturalContext) {
		prompt += `- Living arrangement: ${user.culturalContext.livingArrangement || 'N/A'}
- Support system: ${user.culturalContext.supportSystem || 'N/A'}
- Work status: ${user.culturalContext.workStatus || 'N/A'}
- Household pressure: ${user.culturalContext.householdPressure || 'N/A'}
- Partner/family involvement: ${user.culturalContext.partnerInvolvement || 'N/A'}
`
	}

	if (latestScreening) {
		prompt += `\n**Latest Screening:** ${latestScreening.type} — Score: ${latestScreening.score}, Severity: ${latestScreening.severity}\n`
	}

	if (recentCheckIns && recentCheckIns.length > 0) {
		const recent = recentCheckIns.slice(0, 3)
		prompt += `\n**Recent Moods:** ${recent.map(c => `${c.mood}/10`).join(', ')}\n`
		const symptoms = [...new Set(recent.flatMap(c => c.symptoms))]
		if (symptoms.length) prompt += `**Recent Symptoms:** ${symptoms.join(', ')}\n`
	}

	prompt += `\n**Guidelines:**
- Be empathetic and non-judgmental
- Give practical, actionable advice
- Suggest breathing exercises, grounding techniques, or small steps when appropriate
- Be sensitive to Indian family and cultural dynamics
- Never diagnose or prescribe medication
- If the person seems to be in crisis, gently encourage them to reach out to a helpline
- Keep responses concise (2-3 paragraphs max)
- Respond in the same language the user writes in
`
	return prompt
}

export const sendMessage = async (req, res) => {
	try {
		const userId = req.user.id
		const { message, sessionId } = req.body

		// Crisis keyword check
		const lowerMsg = message.toLowerCase()
		for (const keyword of CRISIS_KEYWORDS) {
			if (lowerMsg.includes(keyword)) {
				let session = sessionId
					? await ChatSession.findById(sessionId)
					: new ChatSession({ userId, messages: [] })
				session.messages.push({ role: 'user', content: message })
				session.messages.push(CRISIS_RESPONSE)
				await session.save()
				return res.status(200).json({
					isCrisis: true,
					response: CRISIS_RESPONSE.content,
					sessionId: session._id,
				})
			}
		}

		// Get user context
		const user = await User.findById(userId)
		const recentCheckIns = await DailyCheckIn.find({ userId }).sort({ createdAt: -1 }).limit(5)
		const latestScreening = await ScreeningResult.findOne({ userId }).sort({ createdAt: -1 })

		// Find or create session
		let session = sessionId
			? await ChatSession.findById(sessionId)
			: new ChatSession({ userId, messages: [] })

		session.messages.push({ role: 'user', content: message })

		// Build messages for OpenRouter
		const systemPrompt = buildSystemPrompt(user, recentCheckIns, latestScreening)
		const apiMessages = [
			{ role: 'system', content: systemPrompt },
			...session.messages.slice(-20).map(m => ({ role: m.role, content: m.content })),
		]

		// Call OpenRouter
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': env.CLIENT_URL,
				'X-Title': 'MatriAI',
			},
			body: JSON.stringify({
				model: 'deepseek/deepseek-r1-0528:free',
				messages: apiMessages,
				max_tokens: 600,
			}),
		})

		const data = await response.json()
		const assistantMessage = data.choices?.[0]?.message?.content || 'I am here for you. Could you share a little more about how you are feeling?'

		session.messages.push({ role: 'assistant', content: assistantMessage })
		await session.save()

		res.status(200).json({
			response: assistantMessage,
			sessionId: session._id,
		})
	} catch (error) {
		res.status(500).json({ message: 'Error processing chat', error: error.message })
	}
}

export const getChatHistory = async (req, res) => {
	try {
		const sessions = await ChatSession.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10)
		res.status(200).json(sessions)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching chat history', error: error.message })
	}
}

export const getSession = async (req, res) => {
	try {
		const session = await ChatSession.findById(req.params.sessionId)
		if (!session) return res.status(404).json({ message: 'Session not found' })
		res.status(200).json(session)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching session', error: error.message })
	}
}
