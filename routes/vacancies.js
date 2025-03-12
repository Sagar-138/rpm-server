const express = require('express');
const vacancyController = require('../controllers/vacancyController');
const router = express.Router();


// CRUD routes for vacancies
router.post("/", vacancyController.createVacancy);
router.get("/", vacancyController.getAllVacancies);
router.get("/:id", vacancyController.getVacancyById);
router.put("/:id", vacancyController.updateVacancy);
router.delete("/:id", vacancyController.deleteVacancy);

module.exports = router;
