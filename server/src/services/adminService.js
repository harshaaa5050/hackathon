import Doctor from '../models/Doctor.js'

export const getPendingDoctors = async (req, res) => {
	try {
		const doctors = await Doctor.find({ verificationStatus: 'pending' }).select('-password')
		res.status(200).json(doctors)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching pending doctors', error: error.message })
	}
}

export const approveDoctor = async (req, res) => {
	try {
		const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
			isVerified: true,
			verificationStatus: 'approved',
		}, { new: true }).select('-password')
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
		res.status(200).json({ message: 'Doctor approved', doctor })
	} catch (error) {
		res.status(500).json({ message: 'Error approving doctor', error: error.message })
	}
}

export const rejectDoctor = async (req, res) => {
	try {
		const { reason } = req.body
		const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
			isVerified: false,
			verificationStatus: 'rejected',
			rejectionReason: reason || 'Application not approved',
		}, { new: true }).select('-password')
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
		res.status(200).json({ message: 'Doctor rejected', doctor })
	} catch (error) {
		res.status(500).json({ message: 'Error rejecting doctor', error: error.message })
	}
}

export const getAllDoctors = async (req, res) => {
	try {
		const doctors = await Doctor.find().select('-password')
		res.status(200).json(doctors)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching doctors', error: error.message })
	}
}
