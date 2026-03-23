import mongoose from 'mongoose'

const communityCommentSchema = new mongoose.Schema({
	threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityThread', required: true },
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
	isAnonymous: { type: Boolean, default: false },
	body: { type: String, required: true },
}, { timestamps: true })

const CommunityComment = mongoose.model('CommunityComment', communityCommentSchema)

export default CommunityComment
