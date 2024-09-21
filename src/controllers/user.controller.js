import pool from "../../db.js";
import { OK, INTERNAL_SERVER } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import {Op} from 'sequelize';

const model = initModels(sequelize);

const createUser = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { full_name, email, pass_word } = req.body;
        // let pass_word1 = "123123"

        // Tạo bản ghi mới trong bảng users
        const newUser = await model.users.create({
            full_name,
            email,
            pass_word
        });

        // Trả về kết quả thành công và dữ liệu vừa tạo
        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        // Bắt lỗi và trả về mã lỗi
        console.error(error);
        res.status(500).json({ message: 'Failed to create user', error });
    }
}

const getUsers = async (req, res) => {
    try {
        // const [data] = await pool.query(`
        //     SELECT * FROM users
        //     LIMIT 1
        // `);
        const searchFullname = req.query.full_name || '';
        let data = await model.users.findAll({
            where: {
                full_name: {
                    [Op.like]: `%${searchFullname}%`
                }
            },
            include: [
                {
                    model: model.video,
                    as: 'videos',
                    attributes: ['video_id', 'video_name'],
                    required: true,  // mặc định sequelize dùng left join
                    include: [
                        {
                            model: model.video_comment,
                            as: 'video_comments',
                            attributes: ['content']
                        }
                    ]
                }
            ]
        });
        res.status(OK).json(data);
    } catch(error) {
        console.log(error)
        res.status(INTERNAL_SERVER).json({message: "error"});
    }
}

const deleteUser = async (req, res) => {
    try {
        let {user_id} = req.params
        // const [data] = await pool.query(`
        //     DELETE FROM users
        //     WHERE user_id = ${user_id}
        // `);
        const user = await model.users.findByPk(user_id);
        if (!user) {
            return res.status(404).json({message: "User not found!"})
        }
        await user.destroy();
        res.status(OK).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(INTERNAL_SERVER).json({message: "error"});
    }
}

export {
    createUser,
    getUsers,
    deleteUser,
}