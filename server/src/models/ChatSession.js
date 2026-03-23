import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
	role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
	content: { type: String, required: true },
}, { timestamps: true })

const chatSessionSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	messages: [messageSchema],
}, { timestamps: true })

const ChatSession = mongoose.model('ChatSession', chatSessionSchema)

export default ChatSession
