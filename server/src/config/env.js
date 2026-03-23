import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const env = {
	PORT: process.env.PORT || 5000,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    MONGO_URI: process.env.MONGO_URI,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
}

export default env
