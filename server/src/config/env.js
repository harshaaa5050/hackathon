import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const env = {
	PORT: process.env.PORT || 5000,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET

}

export default env
