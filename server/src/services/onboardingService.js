import User from '../models/User.js'

export const saveOnboarding = async (req, res) => {
	try {
		const userId = req.user.id
		const { age, lifeStage, culturalContext, lifeStageAnswers } = req.body

		const user = await User.findByIdAndUpdate(userId, {
			age,
			lifeStage,
			culturalContext,
			lifeStageAnswers,
			onboardingComplete: true,
		}, { new: true })

		res.status(200).json({ message: 'Onboarding saved', user })
	} catch (error) {
		res.status(500).json({ message: 'Error saving onboarding', error: error.message })
	}
}

export const getOnboardingStatus = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('onboardingComplete age lifeStage culturalContext lifeStageAnswers')
		res.status(200).json({ onboardingComplete: user.onboardingComplete, user })
	} catch (error) {
		res.status(500).json({ message: 'Error fetching onboarding status', error: error.message })
	}
}
