import DailyCheckIn from '../models/DailyCheckIn.js'
import ScreeningResult from '../models/ScreeningResult.js'

export const getMoodTrends = async (req, res) => {
	try {
		const days = parseInt(req.query.days) || 30
		const since = new Date()
		since.setDate(since.getDate() - days)

		const checkIns = await DailyCheckIn.find({
			userId: req.user.id,
			createdAt: { $gte: since },
		}).sort({ createdAt: 1 })

		const moodData = checkIns.map(c => ({
			date: c.createdAt.toISOString().split('T')[0],
			mood: c.mood,
			anxiety: c.anxietyLevel,
			sleep: c.sleepQuality,
		}))

		res.status(200).json(moodData)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching mood trends', error: error.message })
	}
}

export const getCheckInPatterns = async (req, res) => {
	try {
		const checkIns = await DailyCheckIn.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(90)

		// Aggregate symptoms
		const symptomCount = {}
		checkIns.forEach(c => {
			c.symptoms.forEach(s => {
				symptomCount[s] = (symptomCount[s] || 0) + 1
			})
		})

		// Weekly averages
		const weeklyMoods = {}
		checkIns.forEach(c => {
			const week = getWeekNumber(c.createdAt)
			if (!weeklyMoods[week]) weeklyMoods[week] = { total: 0, count: 0 }
			weeklyMoods[week].total += c.mood
			weeklyMoods[week].count++
		})

		const weeklyAverages = Object.entries(weeklyMoods).map(([week, data]) => ({
			week,
			avgMood: Math.round((data.total / data.count) * 10) / 10,
		}))

		res.status(200).json({
			totalCheckIns: checkIns.length,
			symptomFrequency: symptomCount,
			weeklyAverages,
		})
	} catch (error) {
		res.status(500).json({ message: 'Error fetching patterns', error: error.message })
	}
}

export const getScreeningHistory = async (req, res) => {
	try {
		const results = await ScreeningResult.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20)
		res.status(200).json(results)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching screening history', error: error.message })
	}
}

function getWeekNumber(date) {
	const d = new Date(date)
	const start = new Date(d.getFullYear(), 0, 1)
	const days = Math.floor((d - start) / 86400000)
	return `${d.getFullYear()}-W${Math.ceil((days + 1) / 7)}`
}
