const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// --- EJS Setup ---
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main'); // ملف الـ Template الأساسي
app.set('views', path.join(__dirname, 'views'));

// --- Static Files ---
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // مهم عشان فورمات الـ EJS
app.use(cookieParser());
// --- Routes ---
// 1. Admin SSR Routes
app.use('/admin', require('./routes/adminRoutes'));

// 2. Technician API Routes
// app.use('/api/tech', require('./routes/api/techRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Hybrid Server running on port ${PORT}`.yellow.bold));