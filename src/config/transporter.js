import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Nạp biến môi trường từ file .env
dotenv.config();

// Thiết lập transporter cho Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Xuất transporter để có thể sử dụng trong các file khác
export default transporter;
