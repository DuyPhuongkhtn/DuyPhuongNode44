import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from 'bcrypt';
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
         res.status(200).json({
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
         console.log(token)

         return res.status(200).json({ message: "Success", assessToken: token })
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

      return res.status(200).json({message: "Login successfull"});
   } catch (error) {
      res.status(500).json({ message: "error" });
   }
}

export { register, login, loginFacebook };