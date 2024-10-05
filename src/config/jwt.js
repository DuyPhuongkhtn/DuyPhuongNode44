import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// đọc file .env
dotenv.config();

// create function createToken
export const createToken = (data) => {
    return jwt.sign({payload: data}, process.env.ACCESS_TOKEN_KEY, {
        algorithm: "HS256",
        expiresIn: "10s"
    })
}

export const createRefToken = (data) => {
    return jwt.sign({payload: data}, process.env.REFRESH_SECRET, {
        algorithm: "HS256",
        expiresIn: "7d"
    })
};

const verifyToken = (token) => {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        return true;
    } catch (error) {
        // không verify được token
        return false;
    }
}

// create middlware token
export const middlewareToken = (req, res, next) => {
    let {token} = req.headers;
    let checkToken = verifyToken(token);
    if (checkToken){
        // nếu token hợp lệ => pass => qua router
        next();
    } else {
        return res.status(401).json({message: "Unauthorized"});
    }
}