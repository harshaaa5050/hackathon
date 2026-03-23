import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
import onboardingRouter from './routes/onboardingRoutes.js'
import screeningRouter from './routes/screeningRoutes.js'
import checkinRouter from './routes/checkinRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import communityRouter from './routes/communityRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import analyticsRouter from './routes/analyticsRoutes.js'
import pdfRouter from './routes/pdfRoutes.js'
import adminRouter from './routes/adminRoutes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
)

app.use('/auth', authRouter)
app.use('/onboarding', onboardingRouter)
app.use('/screening', screeningRouter)
app.use('/checkin', checkinRouter)
app.use('/chat', chatRouter)
app.use('/community', communityRouter)
app.use('/doctor', doctorRouter)
app.use('/analytics', analyticsRouter)
app.use('/pdf', pdfRouter)
app.use('/admin', adminRouter)

export default app
