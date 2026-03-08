const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);


// --- مسارات الداشبورد الرئيسية ---
router.get('/', authMiddleware, adminController.getDashboard);
router.get('/dashboard', authMiddleware, adminController.getDashboard);

// --- مسارات إدارة الفنيين (Technicians) ---
// عرض فورم إضافة فني
router.get('/add-tech', authMiddleware, adminController.getAddTechPage);
// استقبال بيانات الفني الجديد
router.post('/add-tech', authMiddleware, adminController.postAddTech);

// --- مسارات إدارة المهام (Tasks) ---
// عرض فورم إضافة مهمة وتعيينها لفني
router.get('/add-task', authMiddleware, adminController.getAddTaskPage);
// استقبال بيانات المهمة وحفظها
router.post('/add-task', authMiddleware, adminController.postAddTask);
// عرض جميع المهام
router.get('/tasks', adminController.getAllTasksPage);
// --- Routes للفنيين ---
router.get('/edit-tech/:id', authMiddleware, adminController.getEditTechPage);
router.post('/edit-tech', authMiddleware, adminController.postEditTech);
router.post('/delete-tech/:id', authMiddleware, adminController.postDeleteTech);

// --- Routes للمهام ---
router.get('/edit-task/:id', authMiddleware, adminController.getEditTaskPage);
router.post('/edit-task', authMiddleware, adminController.postEditTask);
router.post('/delete-task/:id', authMiddleware, adminController.postDeleteTask);
module.exports = router;