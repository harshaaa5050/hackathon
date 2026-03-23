import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateJWT } from '../middlewares/authMiddleware.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, googleId } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            googleId,
        })

        const savedUser = await newUser.save()
        const token = generateJWT ({ id: savedUser._id, email: savedUser.email })
        res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
		})
        res.status(201).json({ message: 'User registered successfully', user: savedUser })
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }
        const token = generateJWT({ id: user._id, email: user.email })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        })
        res.status(200).json({ message: 'Login successful', user })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message })
    }
}