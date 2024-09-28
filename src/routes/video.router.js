import express from 'express';
import { getVideos, getType, getVideoType, getVideoPage,getListVideoType } from '../controllers/video.controller.js';

const videoRoutes = express.Router();

videoRoutes.get("/get-videos", getVideos);
videoRoutes.get("/get-type", getType);
videoRoutes.get("/get-video-type/:typeId", getVideoType);
videoRoutes.get("/get-videos-page/:page/:size", getVideoPage);
videoRoutes.get("/get-video-type-by-id/:typeId", getListVideoType);

export default videoRoutes;