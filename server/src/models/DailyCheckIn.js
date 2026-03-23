import mongoose from 'mongoose'

const dailyCheckInSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	mood: { type: Number, min: 1, max: 10, required: true },
	symptoms: [{ type: String }],
	sleepQuality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
	anxietyLevel: { type: String, enum: ['none', 'mild', 'moderate', 'severe'] },
	appetite: { type: String, enum: ['poor', 'normal', 'good'] },
	energyLevel: { type: String, enum: ['low', 'moderate', 'high'] },
	notes: { type: String, default: '' },
}, { timestamps: true })

const DailyCheckIn = mongoose.model('DailyCheckIn', dailyCheckInSchema)

export default DailyCheckIn
