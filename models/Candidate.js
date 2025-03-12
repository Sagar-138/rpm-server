const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: { type: Number, required: true },
    skills: { type: [String], required: true },
    vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', required: true },
    resume: { type: String, required: true }, // Store the file path
    marks: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
        validate: {
            validator: function(v) {
                return v === null || (v >= 0 && v <= 100);
            },
            message: 'Marks must be between 0 and 100'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'interviewed', 'selected', 'rejected'],
        default: 'pending'
    },
    interviewNotes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
CandidateSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Candidate', CandidateSchema);