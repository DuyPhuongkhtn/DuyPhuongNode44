import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { CloudinaryConfig } from "./cloudinary.config";

@Module({
    providers: [CloudinaryProvider, CloudinaryConfig],
    exports: [CloudinaryProvider]
})
export class CloudinaryModule{}