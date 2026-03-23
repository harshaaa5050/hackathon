import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { createThread, getThreads, getThreadById, searchThreads, addComment, getComments } from '../services/communityService.js'

const communityRouter = express.Router()

communityRouter.post('/threads', verifyJWT, createThread)
communityRouter.get('/threads', getThreads)
communityRouter.get('/threads/search', searchThreads)
communityRouter.get('/threads/:id', getThreadById)
communityRouter.post('/threads/:threadId/comments', verifyJWT, addComment)
communityRouter.get('/threads/:threadId/comments', getComments)

export default communityRouter
