const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    date: Date,
    interviewer: String,
    feedback: String
});

module.exports = mongoose.model('Interview', InterviewSchema);
