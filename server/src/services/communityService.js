import CommunityThread from '../models/CommunityThread.js'
import CommunityComment from '../models/CommunityComment.js'

export const createThread = async (req, res) => {
	try {
		const { title, body, tags, isAnonymous } = req.body
		const thread = new CommunityThread({
			authorId: req.user.id,
			isAnonymous: isAnonymous || false,
			title,
			body,
			tags: tags || [],
		})
		await thread.save()
		res.status(201).json(thread)
	} catch (error) {
		res.status(500).json({ message: 'Error creating thread', error: error.message })
	}
}

export const getThreads = async (req, res) => {
	try {
		const { page = 1, limit = 20, tag } = req.query
		const filter = tag ? { tags: tag } : {}
		const threads = await CommunityThread.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(parseInt(limit))
			.populate('authorId', 'name')
		
		// Hide author for anonymous posts
		const sanitized = threads.map(t => {
			const obj = t.toObject()
			if (obj.isAnonymous) {
				obj.authorId = { name: 'Anonymous' }
			}
			return obj
		})
		res.status(200).json(sanitized)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching threads', error: error.message })
	}
}

export const getThreadById = async (req, res) => {
	try {
		const thread = await CommunityThread.findById(req.params.id).populate('authorId', 'name')
		if (!thread) return res.status(404).json({ message: 'Thread not found' })
		const obj = thread.toObject()
		if (obj.isAnonymous) obj.authorId = { name: 'Anonymous' }
		res.status(200).json(obj)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching thread', error: error.message })
	}
}

export const searchThreads = async (req, res) => {
	try {
		const { q } = req.query
		if (!q) return res.status(400).json({ message: 'Search query is required' })
		const threads = await CommunityThread.find({ $text: { $search: q } })
			.sort({ score: { $meta: 'textScore' } })
			.limit(20)
			.populate('authorId', 'name')
		const sanitized = threads.map(t => {
			const obj = t.toObject()
			if (obj.isAnonymous) obj.authorId = { name: 'Anonymous' }
			return obj
		})
		res.status(200).json(sanitized)
	} catch (error) {
		res.status(500).json({ message: 'Error searching threads', error: error.message })
	}
}

export const addComment = async (req, res) => {
	try {
		const { body, isAnonymous } = req.body
		const threadId = req.params.threadId

		const comment = new CommunityComment({
			threadId,
			authorId: req.user.id,
			isAnonymous: isAnonymous || false,
			body,
		})
		await comment.save()

		await CommunityThread.findByIdAndUpdate(threadId, { $inc: { commentCount: 1 } })
		res.status(201).json(comment)
	} catch (error) {
		res.status(500).json({ message: 'Error adding comment', error: error.message })
	}
}

export const getComments = async (req, res) => {
	try {
		const comments = await CommunityComment.find({ threadId: req.params.threadId })
			.sort({ createdAt: 1 })
			.populate('authorId', 'name')
			.populate('doctorId', 'name specialization')
		
		const sanitized = comments.map(c => {
			const obj = c.toObject()
			if (obj.isAnonymous) {
				obj.authorId = { name: 'Anonymous' }
			}
			return obj
		})
		res.status(200).json(sanitized)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching comments', error: error.message })
	}
}
