import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize';

const model = initModels(sequelize);

const getVideos = async (req, res) => {
    const videos = await model.video.findAll();
    return res.status(200).json(videos)
}

const getVideoPage = async (req, res) => {
    let {page, size} = req.params;
    try{
        page = parseInt(page, 10);
        size = parseInt(size, 10);
        if(isNaN(page) || page < 0){
            page = 1;
        }
        if (isNaN(size) || size < 0){
            size = 5;
        }
        let index = (page - 1) * size;
        let data = await model.video.findAll({
            offset: index,
            limit: size
        })
        let totalPage = Math.ceil(await model.video.count()/size)
        return res.status(200).json({data, totalPage})
    }catch (error) {
        console.log(error);
        return res.status(500).json({messgae: "error"});
    }
}

const getType = async (req, res) => {
    try {
        let data = await model.video_type.findAll()
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ messgae: "error" });
    }
}

const getVideoType = async (req, res) => {
    try{
        let {typeId} = req.params;
        let data = await model.video.findAll({
            where: {
                type_id: typeId
            }
        })
        return res.status(200).json(data);
    }catch(error) {
        res.status(500).json({message: "error"});
    }
}

export {
    getVideos,
    getType,
    getVideoType,
    getVideoPage,
}