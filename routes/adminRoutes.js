const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getDashboard)
router.get('/dashboard', adminController.getDashboard)

// عرض الفورم
router.get('/add-tech', adminController.getAddTechPage);

// استقبال البيانات من الفورم
router.post('/add-tech', adminController.postAddTech);

module.exports = router;