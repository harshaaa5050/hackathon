import mongoose from 'mongoose'

const screeningResultSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String, enum: ['EPDS', 'PHQ4'], required: true },
	answers: [{ questionIndex: Number, answer: Number }],
	score: { type: Number, required: true },
	severity: { type: String, enum: ['low', 'moderate', 'severe'], required: true },
	recommendation: { type: String },
}, { timestamps: true })

const ScreeningResult = mongoose.model('ScreeningResult', screeningResultSchema)

export default ScreeningResult
