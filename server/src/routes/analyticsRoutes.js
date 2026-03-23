import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { getMoodTrends, getCheckInPatterns, getScreeningHistory } from '../services/analyticsService.js'

const analyticsRouter = express.Router()

analyticsRouter.get('/mood', verifyJWT, getMoodTrends)
analyticsRouter.get('/patterns', verifyJWT, getCheckInPatterns)
analyticsRouter.get('/screenings', verifyJWT, getScreeningHistory)

export default analyticsRouter
