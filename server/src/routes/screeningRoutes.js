import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { submitScreening, getScreeningHistory } from '../services/screeningService.js'

const screeningRouter = express.Router()

screeningRouter.post('/', verifyJWT, submitScreening)
screeningRouter.get('/history', verifyJWT, getScreeningHistory)

export default screeningRouter
