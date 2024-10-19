import express from 'express';
import { middlewareToken, middlewareTokenAsyncKey } from '../config/jwt.js';
import { getListVideo, getType, getListVideoType, getVideoPage } from '../controllers/video.controller.js';
import { upload } from '../config/upload.js';
import { uploadCloud } from '../config/cloudinary.js';

const videoRoutes = express.Router();
videoRoutes.get("/get-videos", getListVideo);
videoRoutes.get("/get-type", middlewareTokenAsyncKey, getType);
videoRoutes.get("/get-video-type-by-id/:typeId", getListVideoType);
videoRoutes.get("/get-video-page/:page/:size", getVideoPage);
videoRoutes.post("/upload-base", uploadCloud.single("hinhAnh"), (req, res) => {
    let file = req.file;
    return res.status(200).json(file);
})

export default videoRoutes;