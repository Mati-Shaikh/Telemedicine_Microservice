const Feedback = require('../Models/Feedback.Schema');
const User = require('../Models/User');

// Controller to give feedback
const giveFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const doctorId = req.params.id; // Doctor ID from params
        const patientId = res.locals.userId; // Patient ID from middleware
        const userRole = res.locals.userrole; // Role from middleware
        console.log(userRole);

        if (!doctorId || !feedback) {
            return res.status(400).json({ message: 'Doctor ID and feedback are required.' });
        }

        // Check if the user exists and is a patient
        const user = await User.findById(patientId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (userRole != 'Patient') {
            return res.status(403).json({ message: 'Only patients can provide feedback.' });
        }

        // Check if doctor exists in the User collection
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        // Save feedback
        const newFeedback = new Feedback({
            patientId,
            doctorId,
            feedback,
            patientName: user.name, // Patient name from the user document
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!', data: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback.', error: error.message });
    }
};

// Controller to get feedbacks
const getFeedback = async (req, res) => {
    try {
        const doctorId = res.locals.userId; // Doctor ID from middleware
        const userRole = res.locals.userrole; // Role from middleware
        console.log(userRole);

        if (userRole != 'Doctor') {
            return res.status(403).json({ message: 'Only doctors can view feedback.' });
        }

        // Fetch feedback for the logged-in doctor
        const feedbacks = await Feedback.find({ doctorId }).populate('patientId', 'name');

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this doctor.' });
        }

        res.status(200).json({ message: 'Feedback retrieved successfully!', data: feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback.', error: error.message });
    }
};

module.exports = { giveFeedback, getFeedback };
