const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
    try {

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Resume is required and must be a PDF" });
        }

        
        const { name, email, experience, skills, vacancyId } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: "Resume is required and must be a PDF" });
        }

        const candidate = new Candidate({
            name,
            email,
            experience,
            skills: skills.split(',').map(skill => skill.trim()), // Convert skills from string to array and trim whitespace
            resume: resumePath,
            vacancyId
        });

        await candidate.save();
        res.status(201).json({ 
            success: true,
            message: "Candidate added successfully", 
            candidate 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find()
            .populate('vacancyId')
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.json({
            success: true,
            count: candidates.length,
            candidates
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.addMarks = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { marks, status, interviewNotes } = req.body;

        // Validate marks
        if (marks !== undefined && (marks < 0 || marks > 100)) {
            return res.status(400).json({ 
                success: false,
                message: "Marks must be a number between 0 and 100" 
            });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ 
                success: false,
                message: "Candidate not found" 
            });
        }

        // Update candidate details
        if (marks !== undefined) candidate.marks = marks;
        if (status) candidate.status = status;
        if (interviewNotes) candidate.interviewNotes = interviewNotes;

        await candidate.save();

        res.status(200).json({
            success: true,
            message: "Candidate details updated successfully",
            candidate
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// New endpoint to get a single candidate
exports.getCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;
        
        const candidate = await Candidate.findById(candidateId)
            .populate('vacancyId');
        
        if (!candidate) {
            return res.status(404).json({ 
                success: false,
                message: "Candidate not found" 
            });
        }

        res.json({
            success: true,
            candidate
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Add this to your existing exports
exports.deleteCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const candidate = await Candidate.findById(candidateId);
        
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        // Delete the candidate
        await Candidate.findByIdAndDelete(candidateId);

        res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};