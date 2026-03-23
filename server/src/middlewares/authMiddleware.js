import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export const generateJWT = (user) => {
	const token = jwt.sign(user, env.JWT_SECRET_KEY, {})
	return token
}

export const verifyJWT = (req, res, next) => {
	try {
		const token = req.cookies.token
		if (!token) {
			return res.status(401).json({ message: 'Authentication token missing' })
		}

		const decoded = jwt.verify(token, env.JWT_SECRET_KEY)
		req.user = decoded
		next()
	} catch (error) {
		return res.status(401).json({ message: 'Invalid token' })
	}
}
