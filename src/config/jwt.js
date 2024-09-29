// Chức năng token dùng để xác thực hoặc truyền dữ liệu liên quan đến user
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export const createToken = (data) => {
    // tham số 1 payload: string, buffer, object
    // tham số 2 signalture (secret key)
    // tham số 3 header
    return jwt.sign({ data: data }, process.env.JWT_KEY, { algorithm: "HS256", expiresIn: "5m" })
}

export const verifyToken = (token) => {
    try {
        jwt.verify(token, process.env.JWT_KEY);
        return true; // Token hợp lệ
    } catch (error) {
        console.log("error: ", error)
        return false; // Token không hợp lệ
    }
};

// xử lý refresh token
export const createTokenRef = (data) => {

    return jwt.sign({ data: data }, process.env.REFRESH_SECRET, { algorithm: "HS256", expiresIn: "7d" })
}

export const verifyTokenRef = (token) => {
    try {
        jwt.verify(token, process.env.REFRESH_SECRET);
        return true; // Token hợp lệ
    } catch (error) {
        return false; // Token không hợp lệ
    }
};



export const decodeToken = (token) => {
    return jwt.decode(token)
}

export const middleWareToken = (req, res, next) => {


    let { token } = req.headers;

    console.log("token: ", req.cookies)

    let checkToken = verifyToken(token)
    console.log("checkToken: ", checkToken)
    if (checkToken) {

        next()

    } else {

        res.status(401).send('Unauthorized')
    }
}