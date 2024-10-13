import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize'; // operator: toán tử: LIKE, AND, IN, OR
import { PrismaClient } from '@prisma/client';

const model = initModels(sequelize); // Sequelize

const prisma = new PrismaClient(); // Prisma

const getListVideo = async (req, res) => {
    try {
        // let data = await model.video.findAll(); // return Promise
        let data = await prisma.video.findMany();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error" });
    }
}

const getType = async (req, res) => {
    try {
        // let data = await model.video_type.findAll();
        let data = await prisma.video_type.findMany();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error" });
    }
}

const getListVideoType = async (req, res) => {
    try {
        let { typeId } = req.params;
        // let data = await model.video.findAll({
        //     where: {
        //         type_id: typeId
        //     }
        // })
        // Lưu ý: prisma ràng buộc kiểu dữ liệu nên phải ép kiểu trước khi query.
        let data = await prisma.video.findMany({
            where: {
                type_id: Number(typeId)
            },
            include: {
                users: {
                    select: {
                        full_name: true,
                        email: true
                    }
                }
            }
        })
        if (data.length == 0) {
            return res.status(400).json({ message: "No data" })
        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error" });
    }
}

const getVideoPage = async (req, res) => {
    try {
        let { page, size } = req.params;
        page = parseInt(page, 10); // NaN: not a number
        size = parseInt(size, 10);
        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ message: "page is wrong" });
        }
        if (isNaN(size) || size <= 0) {
            return res.status(400).json({ message: "Size is wrong" });
        }
        let index = (page - 1) * size;

        // let data = await model.video.findAll({
        //     offset: index,
        //     limit: size
        // })
        let data = await prisma.video.findMany({
            skip: index, // offset Sequelie
            take: size // limit Sequelize
        })

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "error" });
    }
}

export {
    getListVideo,
    getType,
    getListVideoType,
    getVideoPage,
}