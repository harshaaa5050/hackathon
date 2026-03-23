import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { registerDoctor, loginDoctor, getDoctorProfile, getDoctorCommunityThreads, doctorAddComment } from '../services/doctorService.js'

const doctorRouter = express.Router()

doctorRouter.post('/register', registerDoctor)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/profile', verifyJWT, getDoctorProfile)
doctorRouter.get('/community', verifyJWT, getDoctorCommunityThreads)
doctorRouter.post('/community/:threadId/comment', verifyJWT, doctorAddComment)

export default doctorRouter
