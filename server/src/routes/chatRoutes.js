import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { sendMessage, getChatHistory, getSession } from '../services/chatService.js'

const chatRouter = express.Router()

chatRouter.post('/send', verifyJWT, sendMessage)
chatRouter.get('/history', verifyJWT, getChatHistory)
chatRouter.get('/session/:sessionId', verifyJWT, getSession)

export default chatRouter
