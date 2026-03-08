const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// عرض صفحة اللوجين (GET)
exports.getLoginPage = (req, res) => {
    res.render('login', {
        title: 'لوحة التحكم ',
        error: null,
        layout: false
    });
};

// منطق تسجيل الدخول (POST)
exports.postLogin = async(req, res) => {
    const { username, password } = req.body;

    try {
        // 1. البحث عن الأدمن
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.render('login', { error: 'اسم المستخدم غير موجود يا سينيور!' });
        }

        // 2. التأكد من الباسورد
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('login', { error: 'الباسورد غلط.. راجع مفاتيحك!' });
        }

        // 3. عمل التوكن (JWT)
        const token = jwt.sign({ id: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'SUPER_SECRET_KEY', { expiresIn: '1d' }
        );

        // 4. حفظ في الكوكيز وتوجيهه للـ Dashboard
        res.cookie('admin_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // يوم واحد
        });

        res.redirect('/admin/dashboard');

    } catch (err) {
        console.error(err);
        res.render('login', { error: 'حصل خطأ في السيرفر!' });
    }
};

// تسجيل الخروج
exports.logout = (req, res) => {
    res.clearCookie('admin_token');
    res.redirect('/admin/login');
};