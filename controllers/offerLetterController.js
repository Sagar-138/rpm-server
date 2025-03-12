const OfferLetter = require('../models/OfferLetter');
const Candidate = require('../models/Candidate');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/offer_letters');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get eligible candidates for offer letter
exports.getEligibleCandidates = async (req, res) => {
    try {
        const eligibleCandidates = await Candidate.find({
            status: 'selected',
            marks: { $exists: true, $ne: null }
        }).populate('vacancyId');

        res.status(200).json({
            success: true,
            candidates: eligibleCandidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Generate offer letter
exports.generateOfferLetter = async (req, res) => {
    try {
        const { candidateId, ...formData } = req.body;
        console.log("Received data:", { candidateId, formData }); // Debug log

        // Fetch candidate with vacancy details
        const candidate = await Candidate.findById(candidateId)
            .populate('vacancyId')
            .exec();

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        if (candidate.status !== 'selected') {
            return res.status(400).json({
                success: false,
                message: 'Candidate is not selected for offer letter'
            });
        }

        // Generate offer letter content
        const content = generateOfferLetterContent(candidate, formData);

        // Create PDF
        const pdfPath = await generatePDF(candidate, content);

        // Save offer letter to database
        const offerLetter = new OfferLetter({
            candidateId: candidate._id,
            vacancyId: candidate.vacancyId._id,
            content: content,
            pdfPath: pdfPath,
            startDate: formData.startDate,
            salary: formData.salary,
            position: formData.position,
            department: formData.department,
            reportingTo: formData.reportingTo,
            workLocation: formData.workLocation,
            companyName: formData.companyName,
            hrManagerName: formData.hrManagerName,
            additionalTerms: formData.additionalTerms
        });

        await offerLetter.save();

        res.status(201).json({
            success: true,
            message: 'Offer letter generated successfully',
            offerLetter
        });
    } catch (error) {
        console.error('Error generating offer letter:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating offer letter'
        });
    }
};

// Helper function to generate PDF
async function generatePDF(candidate, content) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const fileName = `${candidate._id}_${Date.now()}_offer_letter.pdf`;
            const pdfPath = path.join(uploadsDir, fileName);
            
            // Create write stream
            const writeStream = fs.createWriteStream(pdfPath);
            
            // Handle write stream errors
            writeStream.on('error', (error) => {
                console.error('Error writing PDF:', error);
                reject(error);
            });

            // Handle write stream finish
            writeStream.on('finish', () => {
                resolve(pdfPath);
            });

            // Pipe PDF to file
            doc.pipe(writeStream);

            // Add content to PDF with better formatting
            doc.fontSize(20).text('Offer Letter', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(content, {
                align: 'left',
                lineGap: 5
            });

            // Finalize PDF
            doc.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        }
    });
}

// Helper function to generate offer letter content
function generateOfferLetterContent(candidate, formData) {
    const today = new Date().toLocaleDateString();
    return `
Date: ${today}

Dear ${candidate.name},

We are pleased to offer you the position of ${formData.position} at ${formData.companyName}. 
This letter confirms our offer of employment under the following terms:

Position: ${formData.position}
Department: ${formData.department}
Start Date: ${new Date(formData.startDate).toLocaleDateString()}
Annual Salary: ${formData.salary}
Reporting To: ${formData.reportingTo}
Work Location: ${formData.workLocation}
Probation Period: 3 months

Additional Terms:
${formData.additionalTerms || 'N/A'}

This offer is contingent upon:
1. Signing our standard employment agreement
2. Completing required documentation
3. Verification of eligibility to work

We look forward to welcoming you to our team.

Sincerely,
${formData.companyName}
${formData.hrManagerName}
HR Manager
    `.trim();
}

// Preview offer letter
exports.previewOfferLetter = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offerLetter = await OfferLetter.findById(offerId)
            .populate('candidateId')
            .populate('vacancyId');

        if (!offerLetter) {
            return res.status(404).json({
                success: false,
                message: 'Offer letter not found'
            });
        }

        // Format the content for preview
        const formattedContent = offerLetter.content;

        res.status(200).json({
            success: true,
            offerLetter: {
                ...offerLetter.toObject(),
                content: formattedContent
            }
        });
    } catch (error) {
        console.error('Error previewing offer letter:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Download offer letter
exports.downloadOfferLetter = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offerLetter = await OfferLetter.findById(offerId);

        if (!offerLetter || !offerLetter.pdfPath) {
            return res.status(404).json({
                success: false,
                message: 'Offer letter PDF not found'
            });
        }

        // Check if file exists
        if (!fs.existsSync(offerLetter.pdfPath)) {
            return res.status(404).json({
                success: false,
                message: 'PDF file not found'
            });
        }

        res.download(offerLetter.pdfPath);
    } catch (error) {
        console.error('Error downloading offer letter:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};