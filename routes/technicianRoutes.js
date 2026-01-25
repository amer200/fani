const express = require('express');
const router = express.Router();
const { createTechnician } = require('../controllers/technicianController');

// المسار: /api/technicians
router.post('/', createTechnician);

module.exports = router;