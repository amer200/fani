const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// --- مسارات الداشبورد الرئيسية ---
router.get('/', adminController.getDashboard);
router.get('/dashboard', adminController.getDashboard);

// --- مسارات إدارة الفنيين (Technicians) ---
// عرض فورم إضافة فني
router.get('/add-tech', adminController.getAddTechPage);
// استقبال بيانات الفني الجديد
router.post('/add-tech', adminController.postAddTech);

// --- مسارات إدارة المهام (Tasks) ---
// عرض فورم إضافة مهمة وتعيينها لفني
router.get('/add-task', adminController.getAddTaskPage);
// استقبال بيانات المهمة وحفظها
router.post('/add-task', adminController.postAddTask);
// عرض جميع المهام
router.get('/tasks', adminController.getAllTasksPage);
// --- Routes للفنيين ---
router.get('/edit-tech/:id', adminController.getEditTechPage);
router.post('/edit-tech', adminController.postEditTech);
router.post('/delete-tech/:id', adminController.postDeleteTech);

// --- Routes للمهام ---
router.get('/edit-task/:id', adminController.getEditTaskPage);
router.post('/edit-task', adminController.postEditTask);
router.post('/delete-task/:id', adminController.postDeleteTask);
module.exports = router;