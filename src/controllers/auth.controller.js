import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from "../config/transporter.js";
import { createToken } from "../config/jwt.js";

const model = initModels(sequelize);
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
        const userExist = await model.users.findOne({
            where: {
                email: email,
            },
        });
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
        const userNew = await model.users.create({
            full_name: fullName,
            email: email,
            pass_word: bcrypt.hashSync(pass, 10),
        });

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

export { register, login, loginFacebook };