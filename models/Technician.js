const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // هنحتاجه عشان تشفير الباسورد

const technicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'يرجى إضافة اسم الفني'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'يرجى إضافة رقم الهاتف'],
        unique: true, // عشان ميبقاش فيه فنيين بنفس الرقم
        trim: true
    },
    password: {
        type: String,
        required: [true, 'يرجى إضافة كلمة مرور للبوابة'],
        minlength: 6,
        select: false // عشان الباسورد ميرجعش في الـ API Response بالصدفة لأي حد
    },
    specialty: {
        type: String,
        required: [true, 'يرجى تحديد تخصص الفني'], // سباك، كهربائي، فني تكييف...
        trim: true
    },
    status: {
        type: String,
        enum: ['نشط', 'غير نشط'],
        default: 'نشط'
    },
    rating: {
        type: Number,
        default: 5
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true // بيضيف createdAt و updatedAt تلقائياً
});

// تشفير الباسورد قبل الحفظ (Middleware)
technicianSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Technician', technicianSchema);