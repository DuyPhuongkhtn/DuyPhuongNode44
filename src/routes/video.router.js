import express from 'express';
import { getListVideo, getType, getListVideoType, getVideoPage } from '../controllers/video.controller.js';

const videoRoutes = express.Router();
videoRoutes.get("/get-videos", getListVideo);
videoRoutes.get("/get-type", getType);
videoRoutes.get("/get-video-type-by-id/:typeId", getListVideoType);
videoRoutes.get("/get-video-page/:page/:size", getVideoPage);
export default videoRoutes;