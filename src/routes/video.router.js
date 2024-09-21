import express from 'express';
import { getListVideo } from '../controllers/video.controller.js';

const videoRoutes = express.Router();
videoRoutes.get("/get-videos", getListVideo);

export default videoRoutes;