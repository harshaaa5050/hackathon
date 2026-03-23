import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: { type: String, required: true },
	specialization: { type: String, required: true },
	licenseNumber: { type: String, required: true, unique: true },
	experience: { type: Number, required: true },
	bio: { type: String, default: '' },
	isVerified: { type: Boolean, default: false },
	verificationStatus: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
	rejectionReason: { type: String },
}, { timestamps: true })

const Doctor = mongoose.model('Doctor', doctorSchema)

export default Doctor
