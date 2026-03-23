import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { saveOnboarding, getOnboardingStatus } from '../services/onboardingService.js'

const onboardingRouter = express.Router()

onboardingRouter.post('/', verifyJWT, saveOnboarding)
onboardingRouter.get('/status', verifyJWT, getOnboardingStatus)

export default onboardingRouter
