import express from 'express';
import { getVideos } from '../controllers/video.controller.js';

const videoRoutes = express.Router();

videoRoutes.get("/get-videos", getVideos)

export default videoRoutes;