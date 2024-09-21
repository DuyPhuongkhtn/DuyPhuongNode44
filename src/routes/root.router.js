import express from 'express';
import userRoutes from './user.router.js';
import videoRoutes from './video.router.js';

// tạo object router tổng
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes);
rootRoutes.use("/videos", videoRoutes);

// export rootRoutes cho index.js dùng
export default rootRoutes;