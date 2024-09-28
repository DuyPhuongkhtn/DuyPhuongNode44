import dotenv from 'dotenv'
// Nạp các biến môi trường từ file .env
dotenv.config()

export default {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
}