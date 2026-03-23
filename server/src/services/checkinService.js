import DailyCheckIn from '../models/DailyCheckIn.js'

export const submitCheckIn = async (req, res) => {
	try {
		const userId = req.user.id
		const { mood, symptoms, sleepQuality, anxietyLevel, appetite, energyLevel, notes } = req.body

		const checkIn = new DailyCheckIn({
			userId,
			mood,
			symptoms: symptoms || [],
			sleepQuality,
			anxietyLevel,
			appetite,
			energyLevel,
			notes,
		})

		await checkIn.save()
		res.status(201).json({ message: 'Check-in saved', checkIn })
	} catch (error) {
		res.status(500).json({ message: 'Error saving check-in', error: error.message })
	}
}

export const getRecentCheckIns = async (req, res) => {
	try {
		const checkIns = await DailyCheckIn.find({ userId: req.user.id })
			.sort({ createdAt: -1 })
			.limit(30)
		res.status(200).json(checkIns)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching check-ins', error: error.message })
	}
}

export const getTodayCheckIn = async (req, res) => {
	try {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const checkIn = await DailyCheckIn.findOne({
			userId: req.user.id,
			createdAt: { $gte: today },
		})
		res.status(200).json({ completed: !!checkIn, checkIn })
	} catch (error) {
		res.status(500).json({ message: 'Error fetching today check-in', error: error.message })
	}
}
