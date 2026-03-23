import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { submitCheckIn, getRecentCheckIns, getTodayCheckIn } from '../services/checkinService.js'

const checkinRouter = express.Router()

checkinRouter.post('/', verifyJWT, submitCheckIn)
checkinRouter.get('/recent', verifyJWT, getRecentCheckIns)
checkinRouter.get('/today', verifyJWT, getTodayCheckIn)

export default checkinRouter
