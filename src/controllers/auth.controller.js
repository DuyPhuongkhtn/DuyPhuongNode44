import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
      return res.status(200).json({
         message: "Đăng ký thành công",
         data: userNew,
      });
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
        let {email, pass_word} = req.body;

        let user = await model.users.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(400).json({message: "Email is wrong"});
        }

        let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
        if (!checkPass) {
            return res.status(400).json({message: "Password is wrong"});
        }
        let payload = {
            userId: user.user_id
        }

        // tạo token
        // function sign của jwt
        // param 1: tạo payload và lưu vào token
        // param 2: key để tạo token
        // param 3: setting lifetime của token và thuật toán để tạo token
        let accessToken = jwt.sign({payload}, "NODE44", {
            algorithm: "HS256",
            expiresIn: "1d"
        })
        return res.status(200).json({
            message: "Login successfully",
            data: accessToken
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: "error"});
    }
}

export { register, login };