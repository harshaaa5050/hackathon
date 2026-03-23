import express from 'express'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { getPendingDoctors, approveDoctor, rejectDoctor, getAllDoctors } from '../services/adminService.js'
import User from '../models/User.js'

const adminRouter = express.Router()

// Admin guard middleware
const requireAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user || user.role !== 'admin') {
			return res.status(403).json({ message: 'Admin access required' })
		}
		next()
	} catch (error) {
		res.status(500).json({ message: 'Auth error', error: error.message })
	}
}

adminRouter.get('/doctors/pending', verifyJWT, requireAdmin, getPendingDoctors)
adminRouter.get('/doctors', verifyJWT, requireAdmin, getAllDoctors)
adminRouter.post('/doctors/:id/approve', verifyJWT, requireAdmin, approveDoctor)
adminRouter.post('/doctors/:id/reject', verifyJWT, requireAdmin, rejectDoctor)

export default adminRouter
