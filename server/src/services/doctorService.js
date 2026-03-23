import bcrypt from 'bcrypt'
import Doctor from '../models/Doctor.js'
import { generateJWT } from '../middlewares/authMiddleware.js'
import CommunityThread from '../models/CommunityThread.js'
import CommunityComment from '../models/CommunityComment.js'

export const registerDoctor = async (req, res) => {
	try {
		const { name, email, password, specialization, licenseNumber, experience, bio } = req.body
		const hashedPassword = await bcrypt.hash(password, 10)

		const doctor = new Doctor({
			name,
			email,
			password: hashedPassword,
			specialization,
			licenseNumber,
			experience,
			bio,
		})

		const saved = await doctor.save()
		const token = generateJWT({ id: saved._id, email: saved.email, role: 'doctor' })
		res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
		res.status(201).json({ message: 'Registration successful. Pending verification.', doctor: { ...saved.toObject(), password: undefined } })
	} catch (error) {
		res.status(500).json({ message: 'Error registering doctor', error: error.message })
	}
}

export const loginDoctor = async (req, res) => {
	try {
		const { email, password } = req.body
		const doctor = await Doctor.findOne({ email })
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
		const valid = await bcrypt.compare(password, doctor.password)
		if (!valid) return res.status(401).json({ message: 'Invalid password' })
		const token = generateJWT({ id: doctor._id, email: doctor.email, role: 'doctor' })
		res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
		res.status(200).json({ message: 'Login successful', doctor: { ...doctor.toObject(), password: undefined } })
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error: error.message })
	}
}

export const getDoctorProfile = async (req, res) => {
	try {
		const doctor = await Doctor.findById(req.user.id).select('-password')
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
		res.status(200).json(doctor)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching profile', error: error.message })
	}
}

export const getDoctorCommunityThreads = async (req, res) => {
	try {
		const threads = await CommunityThread.find()
			.sort({ createdAt: -1 })
			.limit(50)
			.populate('authorId', 'name')
		const sanitized = threads.map(t => {
			const obj = t.toObject()
			if (obj.isAnonymous) obj.authorId = { name: 'Anonymous' }
			return obj
		})
		res.status(200).json(sanitized)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching threads', error: error.message })
	}
}

export const doctorAddComment = async (req, res) => {
	try {
		const { body } = req.body
		const comment = new CommunityComment({
			threadId: req.params.threadId,
			doctorId: req.user.id,
			body,
			isAnonymous: false,
		})
		await comment.save()
		await CommunityThread.findByIdAndUpdate(req.params.threadId, { $inc: { commentCount: 1 } })
		res.status(201).json(comment)
	} catch (error) {
		res.status(500).json({ message: 'Error adding comment', error: error.message })
	}
}
