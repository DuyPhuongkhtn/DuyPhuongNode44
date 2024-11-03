import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "./cloudinary.config";
import { CloudinaryProvider } from "./cloudinary.provider";

@Module({
    providers: [CloudinaryConfig, CloudinaryProvider],
    exports: [CloudinaryProvider]
})
export class CloudinaryModule{}
// nestjs không hiểu file key do mình tạo
// dù import đúng nơi chưa key nhưng mà nest sẽ ko cho đọc file key
// => tạo service để đọc key