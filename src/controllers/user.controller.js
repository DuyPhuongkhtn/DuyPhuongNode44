import pool from "../../db.js";
import { OK, INTERNAL_SERVER } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize'; // operator: toán tử: LIKE, AND, IN, OR

const model = initModels(sequelize);

const createUser = async (req, res) => {
    // let params = req.params;
    // let {id, hoTen} = params;
    // let body = req.body;
    // res.send({
    //     id,
    //     hoTen
    // });
    // lấy data từ body của request
    try {
        const { full_name, email, pass_word } = req.body;
        let newUser = await model.users.create({
            full_name,
            email,
            pass_word
        })
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(INTERNAL_SERVER).json({ message: "error" });
    }

}

const getUsers = async (req, res) => {
    try {
        // const [data] = await pool.query(`
        //     SELECT * FROM users
        //     LIMIT 1
        // `);
        // let full_name = req.query.full_name || '';
        // console.log("get full_name: ", full_name)
        let { full_name = "" } = req.query;
        let data = await model.users.findAll({
            where: {
                full_name: {
                    [Op.like]: `%${full_name}%`
                },
            },
            attributes: ["full_name"],
            include: [
                {
                    model: model.video, // chọn model mà muốn kết bảng
                    as: 'videos',
                    attributes: ['video_name', 'user_id'], // chỉ định những column nào sẽ hiển thị
                    required: true, // default sẽ kết bảng theo left join, muôn inner join thì required: true
                    include: [
                        {
                            model: model.video_comment,
                            as: 'video_comments'
                        }
                    ]
                }
            ]
        });
        return res.status(OK).json(data);
    } catch (error) {
        return res.status(INTERNAL_SERVER).json({ message: "error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        let { user_id } = req.params
        // const [data] = await pool.query(`
        //     DELETE FROM users
        //     WHERE user_id = ${user_id}
        // `);
        let user = await model.users.findByPk(user_id);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        user.destroy();
        return res.status(OK).json({message: "User deleted successfully!"});
    } catch (error) {
        return res.status(INTERNAL_SERVER).json({ message: "error" });
    }
}

const updateUser = async(req, res) => {
    try{
        const {user_id} = req.params;
        const {full_name, pass_word} = req.body;

        // cách 1:
        // check user có tồn tại trong database hay không
        let user = await model.users.findByPk(user_id);
        // let user = await model.users.findOne({
        //     where: {user_id}
        // })
        if (!user) {
            return res.status(404).json({message: "User not found!"})
        }

        let data = await model.users.update(
            {full_name, pass_word},
            {
                where: {user_id}
            }
        )

        // cách 2: dùng chính object user để update infor user
        // user.full_name = full_name || user.full_name;
        // user.pass_word = pass_word || user.pass_word;
        // await user.save()

        return res.status(OK).json({message: "User updated successfully!"});
    }catch(error) {
        return res.status(INTERNAL_SERVER).json({messgae: "error"});
    }
}

export {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
}