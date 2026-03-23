import express from 'express'
import { loginUser, registerUser, getMe, logoutUser } from '../services/authServices.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'

const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/me', verifyJWT, getMe)
authRouter.post('/logout', logoutUser)

export default authRouter