import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from 'bcrypt';
import { createToken, createTokenRef } from "../config/jwt.js";
import jwt from 'jsonwebtoken';
import fs from 'fs';

// đọc private key và public key
const privateKey = fs.readFileSync('private.key', 'utf-8')
const publicKey = fs.readFileSync('public.key', 'utf-8');

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

      // Cấu hình thông tin email
      const mailOptions = {
         from: process.env.EMAIL_USER,
         to: email,
         subject: 'Welcome to Our Service',
         text: `Hello ${fullName},\n\nThank you for registering!\n\nBest regards,\nYour Company`,
      };

      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
         }
         console.log('Email sent:', info.response);
         return res.status(200).json({
            message: "Đăng ký thành công",
            data: userNew,
         });
      });

      // return res.status(200).json({
      //    message: "Đăng ký thành công",
      //    data: userNew,
      // });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
   }
};

const login = async (req, res) => {
   try {
      let { email, pass_word } = req.body;
    //   const dataTest = req.cookies.refreshToken;
    //   console.log("dataTest: ", dataTest)

      let checkEmail = await model.users.findOne({
         where: {
            email
         }
      })
      if (!checkEmail) {
         return res.status(400).json({ message: "Email is wrong" })
      }
      if (bcrypt.compareSync(pass_word, checkEmail.pass_word)) {
         let token = createToken({ userId: checkEmail.user_id, fullName: checkEmail.full_name })
         let refreshToken = createTokenRef({userId: checkEmail.user_id})
         await model.users.update({refresh_token: refreshToken}, {where: {user_id: checkEmail.user_id}})
         res.cookie('refreshToken', refreshToken, {
            httpOnly: true,      // Cookie không thể truy cập được từ JavaScript để bảo mật
            secure: false,        // Bắt buộc phải chạy trên HTTPS
            sameSite: 'Lax',    // Đảm bảo cookie được gửi trong yêu cầu chéo miền
            maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại là 7 ngày
            path: '/' // đảm bảo cookie có sẵn trên môi route
          });
         return res.status(200).json({ message: "Success", data: token })
      } else {
         return res.status(400).json({ message: "Pass is wrong" })
      }
   } catch (error) {
      return res.status(500).json({ message: error })
   }
}

const loginFacebook = async (req, res) => {
   try {
      let { face_app_id, full_name, email } = req.body


      // check face_app_id
      let checkUser = await model.users.findOne({
         where: {
            face_app_id
         }
      })

      // chưa tồn tại
      if (!checkUser) {

         let newData = {
            full_name,
            email,
            avatar: "",
            pass_word: "", //salt
            face_app_id,
            role: "USER",
            refresh_token: ""
         }

         // INSERT INTO VALUES
         checkUser = await model.users.create(newData)
      }

      let token = createToken({userId: checkUser.user_id});
      let refreshToken = createTokenRef({userId: checkUser.user_id});
      await model.users.update({refresh_token: refreshToken}, {where: { user_id: checkUser.user_id}});
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,      // Cookie không thể truy cập được từ JavaScript để bảo mật
        secure: false,        // Bắt buộc phải chạy trên HTTPS
        sameSite: 'Lax',    // Đảm bảo cookie được gửi trong yêu cầu chéo miền
        maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại là 7 ngày
        path: '/'
      });

      return res.status(200).json({message: "Login successfull", data: token});
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
}

const extendToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401);
    const checkRefToken = await model.users.findOne({
        where: {
            refresh_token: refreshToken
        }
    })
    console.log("get data: ", checkRefToken)
    if (!checkRefToken) {
        return res.status(401);
    }
    jwt.verify(refreshToken, "NODE_44_REFRESH", (err, user) => {
        if (err) return res.status(403);

        const token = createToken({userId: user.data.userId})
        console.log("ok: ", token)
        return res.status(200).json({message: "Success", data: token});
    })
}

const loginAsyncKey = async (req, res) => {
    const {email, pass_word} = req.body;

    const payload = {email};

    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });

    return res.status(200).json({token});
}

const verifyAsyncKey = async (req, res) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({message: "Token not found"});
    }

    jwt.verify(token, publicKey, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Invalid token"});
        }

        return res.status(200).json({message: "OK", data: decoded});
    })
}

export { register, login, loginFacebook, extendToken, loginAsyncKey, verifyAsyncKey };