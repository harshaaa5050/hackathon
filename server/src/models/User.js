import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
		trim: true,
		lowercase: true,
	},
	password: { type: String, required: true },
	googleId: { type: String },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },
	onboardingComplete: { type: Boolean, default: false },
	age: { type: Number },
	lifeStage: { type: String, enum: ['pregnancy', 'postpartum', 'miscarriage', 'menopause'] },
	culturalContext: {
		livingArrangement: { type: String },
		supportSystem: { type: String },
		workStatus: { type: String },
		householdPressure: { type: String },
		partnerInvolvement: { type: String },
	},
	lifeStageAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User