import express from 'express';
import { getVideos, getType, getVideoType, getVideoPage } from '../controllers/video.controller.js';

const videoRoutes = express.Router();

videoRoutes.get("/get-videos", getVideos);
videoRoutes.get("/get-types", getType);
videoRoutes.get("/get-video-type/:typeId", getVideoType);
videoRoutes.get("/get-videos-page/:page/:size", getVideoPage)

export default videoRoutes;