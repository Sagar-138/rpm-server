const mongoose = require('mongoose');

const OfferLetterSchema = new mongoose.Schema({
    candidateId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Candidate',
        required: true 
    },
    vacancyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vacancy',
        required: true 
    },
    issuedDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'],
        default: "pending" 
    },
    content: { 
        type: String,
        required: true 
    },
    pdfPath: { 
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    reportingTo: {
        type: String,
        required: true
    },
    workLocation: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    hrManagerName: {
        type: String,
        required: true
    },
    additionalTerms: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OfferLetter', OfferLetterSchema);