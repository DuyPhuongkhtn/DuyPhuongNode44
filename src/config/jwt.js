// Chức năng token dùng để xác thực hoặc truyền dữ liệu liên quan đến user
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export const createToken = (data) => {
    // tham số 1 payload: string, buffer, object
    // tham số 2 signalture (secret key)
    // tham số 3 header
    return jwt.sign({ data: data }, process.env.JWT_KEY, { algorithm: "HS256", expiresIn: "5s" })
}

export const verifyToken = (token) => {
    // khác khóa bí mật
    // kiểm tra token 
    // hợp lệ error = null, ko hợp lệ error != null

    return jwt.verify(token, process.env.JWT_KEY, (error) => { return error })
}