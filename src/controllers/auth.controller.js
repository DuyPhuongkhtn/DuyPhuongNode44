import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // lib để tạo random code cho flow forgot password
import transporter from "../config/transporter.js";
import { createRefToken, createRefTokenAsyncKey, createToken, createTokenAsyncKey, verifyTokenAsyncKey } from "../config/jwt.js";
import {PrismaClient} from '@prisma/client';
import speakeasy from 'speakeasy'; // lib tạo secret key

const model = initModels(sequelize);

const prisma = new PrismaClient();

const register = async (req, res, next) => {
    try {
        /**
         * Bước 1: nhận dữ liệu từ FE
         */
        const { fullName, email, pass } = req.body;
        console.log({ fullName, email, pass });
        /**
         * Bước 2: kiểm tra email xem đã tồn tại trong db hay chưa
         *    - nếu tồn tại: trả lỗi "Tài khoản đã tồn tại"
         *    - nếu chưa tồn tại: đi tiêp
         */
        // const userExist = await model.users.findOne({
        //     where: {
        //         email: email,
        //     },
        // });
        const userExist = await prisma.users.findFirst({
            where: {
                email
            }
        })

        console.log({ userExist });
        if (userExist) {
            return res.status(400).json({
                message: `Tài khoản đã tồn tại`,
                data: null,
            });
        }
        /**
         * mã hoá pass
         */
        /**
         * Bước 3: thêm người dùng mới vào db
         */
        // const userNew = await model.users.create({
        //     full_name: fullName,
        //     email: email,
        //     pass_word: bcrypt.hashSync(pass, 10),
        // });
        // tạo secret cho login 2 lớp
        const secret = speakeasy.generateSecret({length: 15});
        console.log("secret: ", secret.base32)
        const userNew = await prisma.users.create({
            data: {
                full_name: fullName,
                email,
                pass_word: bcrypt.hashSync(pass, 10),
                secret: secret.base32
            }
        })

        //   cấu hình info email
        const mailOption = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Welcome to Our service",
            text: `Hello ${fullName}. ${pass} Best Regards.`,
            html: `<h1>ahihihi đồ ngốc</h1>`
        }

        //   gửi email
        transporter.sendMail(mailOption, (err, info) => {
            if(err) {
                return res.status(500).json({message: "Sending email error"});
            }
            return res.status(200).json({
                message: "Đăng ký thành công",
                data: userNew,
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
};

const login = async (req, res) => {
    try {
        // B1: lấy email và pass_word từ body request
        // B2: check user thông qua email (get user từ db)
        //   B2.1: nếu không có user => ra error user not found
        //   B2.2: nếu có user => check tiếp pass_word
        //      B2.2.1: nếu password ko trùng nhau => ra error password is wrong
        //      B2.2.2: nếu password trùng nhau => tạo access token
        let { email, pass_word } = req.body;

        let user = await model.users.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(400).json({ message: "Email is wrong" });
        }

        let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
        if (!checkPass) {
            return res.status(400).json({ message: "Password is wrong" });
        }
        let payload = {
            userId: user.user_id
        }

        // tạo token
        // function sign của jwt
        // param 1: tạo payload và lưu vào token
        // param 2: key để tạo token
        // param 3: setting lifetime của token và thuật toán để tạo token
        let accessToken = createToken({userId: user.user_id})
        // create refresh token và lưu vào database
        let refreshToken = createRefToken({userId: user.user_id});
        await model.users.update({
            refresh_token: refreshToken
        }, {
            where: {user_id: user.user_id}
        });

        // lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Cookie không thể truy cập từ javascript
            secure: false, // để chạy dưới localhost
            sameSite: 'Lax', // để đảm bảo cookie được gửi trong các domain khác nhau
            maxAge: 7 * 24 * 60 * 60 * 1000 //thời gian tồn tại cookie trong browser
        })

        return res.status(200).json({
            message: "Login successfully",
            data: accessToken
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
}

const loginFacebook = async (req, res) => {
    try {
        // B1: lấy id, email và name từ request
        // B2: check id (app_face_id trong db)
        // B2.1: nếu có app_face_id => tạo access token => gửi về FE
        // B2.2: nếu kko có app_face_id => tạo user mới => tạo access token => gửi về FE
        let { id, email, name } = req.body;
        let user = await model.users.findOne({
            where: { face_app_id: id }
        })
        if (!user) {
            let newUser = {
                full_name: name,
                face_app_id: id,
                email
            }
            user = await model.users.create(newUser);
        }
        let accessToken = createToken({userId: user.user_id})
        return res.status(200).json({
            message: "Login successfully",
            data: accessToken
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" })
    }
}

const extendToken = async (req, res) => {
    // lấy refresh token từ cookie request
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401)
    }

    const checkRefToken = await model.users.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!checkRefToken) {
        return res.status(401);
    }

    // const newToken = createToken({userId: checkRefToken.user_id})
    // tạo access token mới
    const newToken = createTokenAsyncKey({userId: checkRefToken.user_id})
    return res.status(200).json({message: "Success", data: newToken});
}

const loginAsyncKey = async (req, res) => {
    try {
        // B1: lấy email và pass_word từ body request
        // B2: check user thông qua email (get user từ db)
        //   B2.1: nếu không có user => ra error user not found
        //   B2.2: nếu có user => check tiếp pass_word
        //      B2.2.1: nếu password ko trùng nhau => ra error password is wrong
        //      B2.2.2: nếu password trùng nhau => tạo access token
        let { email, pass_word, code } = req.body;

        // let user = await model.users.findOne({
        //     where: {
        //         email
        //     }
        // })

        let user = await prisma.users.findFirst({
            where: {email}
        })
        if (!user) {
            return res.status(400).json({ message: "Email is wrong" });
        }

        let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
        if (!checkPass) {
            return res.status(400).json({ message: "Password is wrong" });
        }

        // check code được nhập từ request:
        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: code //laấy từ google authenticator
        })

        if (!verified) {
            return res.status(400).json({message: "Invalid 2FA"});
        }

        let payload = {
            userId: user.user_id
        }

        // tạo token
        // function sign của jwt
        // param 1: tạo payload và lưu vào token
        // param 2: key để tạo token
        // param 3: setting lifetime của token và thuật toán để tạo token
        let accessToken = createTokenAsyncKey({userId: user.user_id})
        // create refresh token và lưu vào database
        let refreshToken = createRefTokenAsyncKey({userId: user.user_id});
        await model.users.update({
            refresh_token: refreshToken
        }, {
            where: {user_id: user.user_id}
        });

        // lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Cookie không thể truy cập từ javascript
            secure: false, // để chạy dưới localhost
            sameSite: 'Lax', // để đảm bảo cookie được gửi trong các domain khác nhau
            maxAge: 7 * 24 * 60 * 60 * 1000 //thời gian tồn tại cookie trong browser
        })

        return res.status(200).json({
            message: "Login successfully",
            data: accessToken
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
}

const verifyAccessTokenAsyncKey = (req, res) => {
    let {token} = req.headers;
    let checkToken = verifyTokenAsyncKey(token)
    return res.status(200).json({checkToken});
}

const forgotPass = async (req, res) => {
    try{
        // get email from body
        console.log("forgot password")
        let {email} = req.body;
        console.log("email:", email)

        // kiểm tra email có tồn tại trong database
        let checkEmail = await model.users.findOne({
            where: {
                email
            }
        });

        if (!checkEmail) {
            return res.status(400).json({message: "Email is wrong"});
        }

        // tạo code
        let randomCode = crypto.randomBytes(5).toString("hex");

        // tạo biến lưu expired code
        let expired = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
        // lưu code vào database
        await model.code.create({
            code: randomCode,
            expired
        })

        // send email
        //   cấu hình info email
        const mailOption = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Mã xác thực",
            text: `Hệ thống gửi bạn mã code forgot password`,
            html: `<h1>${randomCode}</h1>`
        }

        //   gửi email
        transporter.sendMail(mailOption, (err, info) => {
            if(err) {
                console.log(err)
                return res.status(500).json({message: "Sending email error"});
            }
            return res.status(200).json({
                message: "Please check your email."
            });
        })
    } catch (error) {
        return res.status(500).json({message: "error API forgot password"});
    }
}

const changePassword = async (req, res) => {
    try {
        let {code, email, newPass} = req.body;
        // kiểm tra code có tồn tại trong db hay không
        let checkCode = await model.code.findOne({
            where: {
                code
            }
        })
        if (!checkCode) {
            return res.status(400).json({message: "Code is wrong"});
        }

        // check code có còn expire hay ko

        // kieểm tra email có tồn tại trong db hay không
        let checkEmail = await model.users.findOne({
            where: {email}
        });

        if (!checkEmail) {
            return res.status(400).json({message: "Email is wrong"});
        }

        let hashNewPass = bcrypt.hashSync(newPass, 10);
        checkEmail.pass_word = hashNewPass;
        checkEmail.save();

        // remove code sau khi change password thành công
        await model.code.destroy({
            where: {code}
        })

        return res.status(200).json({message: "Change password successfully"});

    } catch (error) {
        return res.status(500).json({message: "error API change password"});
    }
}

export {
    register,
    login,
    loginFacebook,
    extendToken,
    loginAsyncKey,
    verifyAccessTokenAsyncKey,
    forgotPass,
    changePassword
};