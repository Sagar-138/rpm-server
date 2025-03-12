const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    noticePeriod: { type: String, required: true },
    bond: { type: Boolean, default: false },
    skillsRequired: {
      primary: { type: [String], required: true },
      secondary: { type: [String], required: true },
    },
    responsibilities: { type: [String], required: true },
    qualifications: { type: [String], required: true },
  },
  { timestamps: true }
);

const Vacancy = mongoose.model("Vacancy", vacancySchema);
module.exports = Vacancy;
