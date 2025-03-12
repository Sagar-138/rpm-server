const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/uploads/resumes', express.static('uploads/resumes')); // Serve uploaded files
app.use('/api/vacancies', require('./routes/vacancies'));
app.use('/api/candidates', require('./routes/Candidate'));
app.use('/api/interviews', require('./routes/interview'));
app.use('/api/offer-letters',require('./routes/OfferLetter') );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
