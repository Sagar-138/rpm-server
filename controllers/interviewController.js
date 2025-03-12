const Interview = require('../models/Interview');

exports.scheduleInterview = async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();
        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
