const express = require('express');
const { 
    generateOfferLetter, 
    getEligibleCandidates,
    previewOfferLetter,
    downloadOfferLetter 
} = require('../controllers/offerLetterController');

const router = express.Router();

// Get eligible candidates for offer letter
router.get('/eligible-candidates', getEligibleCandidates);

// Generate offer letter
router.post('/generate', generateOfferLetter);

// Preview offer letter
router.get('/preview/:candidateId', previewOfferLetter);

// Download offer letter
router.get('/download/:offerId', downloadOfferLetter);

module.exports = router;