const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.admin_token; // هنجيب التوكن من الكوكيز
    if (!token) {
        return res.redirect('/admin/login'); // لو مفيش توكن، ارجع لصفحة اللوجين
    }

    try {
        const decoded = jwt.verify(token, 'SUPER_SECRET_KEY'); // اتأكد من صحة التوكن
        req.admin = decoded;
        next();
    } catch (err) {
        res.clearCookie('admin_token');
        return res.redirect('/admin/login');
    }
};