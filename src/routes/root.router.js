import express from 'express';
import userRoutes from './user.router.js';

// tạo object router tổng
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes);

// export rootRoutes cho index.js dùng
export default rootRoutes;