import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { generatePDF } from '../services/pdfService.js'

const pdfRouter = express.Router()

pdfRouter.get('/report', verifyJWT, generatePDF)

export default pdfRouter
