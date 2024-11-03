import { Module } from "@nestjs/common";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { CloudUploadService } from "./cloudUpload.service";

@Module({
    imports: [CloudinaryModule],
    providers: [CloudUploadService],
    exports: [CloudUploadService]
})
export class ShareModule{}