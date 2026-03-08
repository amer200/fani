const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// وصل بالداتا بيز بتاعتك هنا
mongoose.connect('mongodb://localhost:27017/fani');

const seedAdmins = async() => {
    // نمسح أي أدمن قديم عشان نبدأ من الصفر بجد
    await Admin.deleteMany({});

    const admins = [
        { username: 'Admin1990', password: '123' },
        { username: 'Mohammed', password: '123' },
        { username: 'Admin1992', password: '123' }
    ];

    for (let a of admins) {
        a.password = await bcrypt.hash(a.password, 12); // تشفير
    }

    await Admin.insertMany(admins);
    console.log("تم إضافة الـ ٣ أدمن بنجاح! اقفل الملف ده خلاص.");
    process.exit();
};

seedAdmins();