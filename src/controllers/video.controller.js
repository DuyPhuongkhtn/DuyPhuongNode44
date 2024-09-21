import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import {Op} from 'sequelize';

const model = initModels(sequelize);

const getVideos = async(req, res) => {
    const videos = await model.video.findAll();
    return res.status(200).json(videos)
}

export {
    getVideos,
}