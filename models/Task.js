const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // 1. بيانات العميل (عشان الفني يعرف هيروح لمين)
    clientName: {
        type: String,
        required: [true, 'اسم العميل مطلوب'],
        trim: true
    },
    clientAddress: {
        type: String,
        required: [true, 'عنوان العميل مطلوب']
    },
    clientPhone: {
        type: String,
        required: [true, 'رقم تليفون العميل مطلوب']
    },

    // 2. تفاصيل المهمة
    description: {
        type: String,
        required: [true, 'وصف المهمة مطلوب']
    },
    taskType: {
        type: String,
        enum: ['تركيب', 'صيانة', 'معاينة'],
        default: 'صيانة'
    },

    // 3. الربط مع الفني (الـ Reference)
    assignedTechnician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician', // لازم يكون نفس الاسم اللي في موديول الفني
        required: [true, 'يجب تعيين فني للمهمة']
    },

    // 4. تتبع الحالة (قلب اللوجيك)
    status: {
        type: String,
        enum: ['قيد الانتظار', 'جاري العمل', 'تم الانجاز'],
        default: 'قيد الانتظار'
    },

    // 5. التوثيق (الصور)
    beforeImages: [{
        type: String // هنخزن الـ URL بتاع الصورة
    }],
    afterImages: [{
        type: String
    }],

    // 6. التواريخ
    startedAt: { type: Date },
    completedAt: { type: Date }

}, {
    timestamps: true // بيعمل createdAt و updatedAt لوحده
});

module.exports = mongoose.model('Task', taskSchema);