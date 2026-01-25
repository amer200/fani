const Technician = require('../models/Technician');

// @desc    إضافة فني جديد
// @route   POST /api/technicians
// @access  Private (Admin Only)
exports.createTechnician = async(req, res) => {
    try {
        const { name, phone, password, specialty } = req.body;

        // التأكد من عدم وجود فني بنفس الرقم
        const technicianExists = await Technician.findOne({ phone });
        if (technicianExists) {
            return res.status(400).json({ success: false, message: 'هذا الرقم مسجل بالفعل لفني آخر' });
        }

        // إنشاء الفني
        const technician = await Technician.create({
            name,
            phone,
            password,
            specialty
        });

        res.status(201).json({
            success: true,
            data: technician
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في السيرفر أثناء إضافة الفني',
            error: error.message
        });
    }
};