import mongoose from 'mongoose'

const communityThreadSchema = new mongoose.Schema({
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	isAnonymous: { type: Boolean, default: false },
	title: { type: String, required: true, trim: true },
	body: { type: String, required: true },
	tags: [{ type: String }],
	likeCount: { type: Number, default: 0 },
	commentCount: { type: Number, default: 0 },
}, { timestamps: true })

communityThreadSchema.index({ title: 'text', body: 'text', tags: 'text' })

const CommunityThread = mongoose.model('CommunityThread', communityThreadSchema)

export default CommunityThread
