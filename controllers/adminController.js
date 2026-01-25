const Technician = require('../models/Technician');
const Task = require('../models/Task')
    // عرض ال main
exports.getDashboard = async(req, res) => {
    try {
        // 1. جلب البيانات من الـ Database في وقت واحد (Optimization)
        const [techs, tasks, completedTasksCount, pendingTasksCount] = await Promise.all([
            Technician.find().sort({ createdAt: -1 }), // جلب كل الفنيين (الأحدث أولاً)
            Task.find().populate('assignedTechnician').limit(5), // آخر 5 مهام
            Task.countDocuments({ status: 'تم الانجاز' }), // عدد المهام المكتملة
            Task.countDocuments({ status: 'قيد الانتظار' }) // عدد المهام المنتظرة
        ]);

        // 2. عملية الـ Render وبص معانا على الـ Data اللي مبعوتة
        res.render('admin/dashboard', {
            title: 'لوحة التحكم | صرح عامر',
            techs: techs, // قائمة الفنيين للجدول
            tasks: tasks, // قائمة المهام
            completedCount: completedTasksCount, // رقم الكارد الأخضر
            pendingCount: pendingTasksCount, // رقم الكارد الأحمر
            totalTechs: techs.length // رقم كارد الفنيين
        });

    } catch (error) {
        console.error('Error in Dashboard Controller:', error);
        res.status(500).send('عذراً، حدث خطأ في النظام أثناء جلب بيانات الداشبورد');
    }
}

// 1. عرض صفحة "إضافة فني"
exports.getAddTechPage = (req, res) => {
    res.render('admin/add-tech', { title: 'إضافة فني جديد' });
};

// 2. معالجة بيانات الفني وحفظها
exports.postAddTech = async(req, res) => {
    try {
        const { name, phone, password, specialty } = req.body;

        // حفظ في الـ Model
        await Technician.create({
            name,
            phone,
            password, // الـ Model هيقوم بتشفيره تلقائياً كما برمجنا سابقاً
            specialty
        });

        // بعد الحفظ، نرجعه لصفحة الداشبورد
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('حدث خطأ أثناء إضافة الفني');
    }
};