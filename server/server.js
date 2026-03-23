import express from 'express'
import app from './src/app.js'
import env from './src/config/env.js'

const server = express()

server.use('/api', app)

server.listen(env.PORT, () => {
	console.log(`Server is running on port ${env.PORT}`)
})

server.get('/', (req, res) => {
	res.send('Welcome to the Hackathon Project')
})
