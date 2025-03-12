const express = require("express");
const multer = require("multer");
const { addCandidate, getCandidates,addMarks,getCandidate, deleteCandidate  } = require("../controllers/candidateController");

const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const upload = multer({ 
    storage
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype !== "application/pdf") {
    //         return cb(new Error("Only PDFs are allowed!"), false);
    //     }
    //     cb(null, true);
    // }
});

// Use multer for candidate upload
router.post("/", upload.single("resume"), addCandidate);
router.get("/", getCandidates);

router.patch("/:candidateId/marks", addMarks);

router.get("/:candidateId", getCandidate);
router.delete("/:candidateId", deleteCandidate);

module.exports = router;
