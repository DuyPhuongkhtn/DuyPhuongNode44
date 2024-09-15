import pool from "../../db.js";
import { OK, INTERNAL_SERVER } from "../../const.js";

const createUser = (req, res) => {
    let params = req.params;
    let {id, hoTen} = params;
    let body = req.body;
    res.send({
        id,
        hoTen
    });
}

const getUsers = async (req, res) => {
    try {
        const [data] = await pool.query(`
            SELECT * FROM users
            LIMIT 1
        `);
        res.status(OK).json(data);
    } catch(error) {
        res.status(INTERNAL_SERVER).json({message: "error"});
    }
}

const deleteUser = async (req, res) => {
    try {
        let {user_id} = req.params
        const [data] = await pool.query(`
            DELETE FROM users
            WHERE user_id = ${user_id}
        `);
        res.status(OK).json(data);
    } catch (error) {
        res.status(INTERNAL_SERVER).json({message: "error"});
    }
}

export {
    createUser,
    getUsers,
    deleteUser,
}