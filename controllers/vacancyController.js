const Vacancy = require("../models/Vacancy");

// Create a new vacancy
exports.createVacancy = async (req, res) => {
  try {
    const vacancy = new Vacancy(req.body);
    await vacancy.save();
    res.status(201).json({ message: "Vacancy created successfully", vacancy });
  } catch (error) {
    res.status(500).json({ message: "Error creating vacancy", error });
  }
};

// Get all vacancies
exports.getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vacancies", error });
  }
};

// Get a single vacancy by ID
exports.getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
    res.status(200).json(vacancy);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vacancy", error });
  }
};

// Update a vacancy
exports.updateVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
    res.status(200).json({ message: "Vacancy updated successfully", vacancy });
  } catch (error) {
    res.status(500).json({ message: "Error updating vacancy", error });
  }
};

// Delete a vacancy
exports.deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
    res.status(200).json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vacancy", error });
  }
};
