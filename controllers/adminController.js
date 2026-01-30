const Technician = require('../models/Technician');
const Task = require('../models/Task');

// --- 1. عرض الـ Dashboard الرئيسية ---
exports.getDashboard = async(req, res) => {
    try {
        const [techs, tasks, completedTasksCount, pendingTasksCount] = await Promise.all([
            Technician.find().sort({ createdAt: -1 }),
            Task.find().populate('assignedTechnician').sort({ createdAt: -1 }).limit(5), // جبنا أحدث 5 مهام مع بيانات الفني
            Task.countDocuments({ status: 'تم الانجاز' }),
            Task.countDocuments({ status: 'قيد الانتظار' })
        ]);

        res.render('admin/dashboard', {
            title: 'لوحة التحكم ',
            techs,
            tasks,
            completedCount: completedTasksCount,
            pendingCount: pendingTasksCount,
            totalTechs: techs.length
        });
    } catch (error) {
        console.error('Error in Dashboard Controller:', error);
        res.status(500).send('عذراً، حدث خطأ في النظام');
    }
}

// --- 2. إدارة الفنيين ---
exports.getAddTechPage = (req, res) => {
    res.render('admin/add-tech', { title: 'إضافة فني جديد' });
};

exports.postAddTech = async(req, res) => {
    try {
        const { name, phone, password, specialty } = req.body;
        await Technician.create({ name, phone, password, specialty });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send('حدث خطأ أثناء إضافة الفني');
    }
};

// --- 3. إدارة المهام (Tasks) ---

// عرض صفحة إضافة مهمة (محتاجين نجيب الفنيين عشان نختار منهم)
exports.getAddTaskPage = async(req, res) => {
    try {
        const techs = await Technician.find().select('name specialty'); // نجيب الاسم والتخصص بس لتقليل الداتا
        res.render('admin/add-task', {
            title: 'إضافة مهمة جديدة',
            techs: techs
        });
    } catch (error) {
        res.status(500).send('خطأ في تحميل صفحة إضافة المهمة');
    }
};

// معالجة إضافة المهمة وتوجيهها للفني
exports.postAddTask = async(req, res) => {
    try {
        const {
            clientName,
            clientAddress,
            clientPhone,
            description,
            taskType,
            assignedTechnician
        } = req.body;

        await Task.create({
            clientName,
            clientAddress,
            clientPhone,
            description,
            taskType,
            assignedTechnician
        });

        // روعة الـ Redirect هنا إنه هيرجعك للداشبورد تشوف المهمة نزلت فوراً في الـ Recent Tasks
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ أثناء إضافة المهمة وتوجيهها');
    }
};

// عرض صفحة جميع المهام
exports.getAllTasksPage = async(req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTechnician', 'name specialty')
            .sort({ createdAt: -1 }); // الأحدث يظهر في الأول

        res.render('admin/all-tasks', {
            title: 'جميع المهام ',
            tasks: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في تحميل صفحة المهام');
    }
};
// --- تعديل بيانات فني (عرض الصفحة) ---
exports.getEditTechPage = async(req, res) => {
    try {
        const techId = req.params.id;
        const tech = await Technician.findById(techId);
        res.render('admin/edit-tech', {
            title: 'تعديل بيانات فني',
            tech: tech
        });
    } catch (error) {
        res.status(500).send('خطأ في تحميل صفحة التعديل');
    }
};

// --- حفظ التعديلات للفني ---
exports.postEditTech = async(req, res) => {
    try {
        const { id, name, phone, specialty } = req.body;
        await Technician.findByIdAndUpdate(id, { name, phone, specialty });
        res.redirect('/admin/dashboard'); // أو صفحة كل الفنيين
    } catch (error) {
        res.status(500).send('حدث خطأ أثناء تحديث بيانات الفني');
    }
};

// --- حذف فني ---
exports.postDeleteTech = async(req, res) => {
    try {
        const techId = req.params.id;
        await Technician.findByIdAndDelete(techId);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send('خطأ أثناء حذف الفني');
    }
};
// --- تعديل مهمة (عرض الصفحة) ---
exports.getEditTaskPage = async(req, res) => {
    try {
        const taskId = req.params.id;
        const [task, techs] = await Promise.all([
            Task.findById(taskId).populate('assignedTechnician'),
            Technician.find().select('name specialty')
        ]);

        res.render('admin/edit-task', {
            title: 'تعديل المهمة',
            task: task,
            techs: techs
        });
    } catch (error) {
        res.status(500).send('خطأ في تحميل صفحة تعديل المهمة');
    }
};

// --- حفظ تعديلات المهمة ---
exports.postEditTask = async(req, res) => {
    try {
        const { id, clientName, clientAddress, clientPhone, description, taskType, assignedTechnician, status } = req.body;

        await Task.findByIdAndUpdate(id, {
            clientName,
            clientAddress,
            clientPhone,
            description,
            taskType,
            assignedTechnician,
            status
        });

        res.redirect('/admin');
    } catch (error) {
        res.status(500).send('حدث خطأ أثناء تحديث المهمة');
    }
};

// --- حذف مهمة ---
exports.postDeleteTask = async(req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.redirect('/admin/tasks');
    } catch (error) {
        res.status(500).send('خطأ أثناء حذف المهمة');
    }
};