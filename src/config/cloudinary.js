import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Cấu hình dotenv để sử dụng các biến môi trường
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình bộ lưu trữ cho Multer với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',  // Thư mục trên Cloudinary
    format: async (req, file) => {
        // Lấy định dạng từ mimetype của file
        const validFormats = ['jpeg', 'png', 'gif', 'webp'];  // Các định dạng cho phép
        const fileFormat = file.mimetype.split('/')[1];  // Lấy phần định dạng từ mimetype
  
        // Kiểm tra xem định dạng của file có trong danh sách hợp lệ hay không
        if (validFormats.includes(fileFormat)) {
          return fileFormat;
        }
  
        // Nếu không hợp lệ, trả về định dạng mặc định (ví dụ 'png')
        return 'png';
      },
    public_id: (req, file) => file.originalname.split('.')[0],  // Tên ảnh
  },
});

// Khởi tạo Multer với Cloudinary storage
export const uploadCloud = multer({ storage });
