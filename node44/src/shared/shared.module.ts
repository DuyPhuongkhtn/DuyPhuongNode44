import { Module } from "@nestjs/common";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { UploadService } from "./upload.service";

@Module({
    imports: [CloudinaryModule],
    providers: [UploadService],
    exports: [UploadService]
})
export class SharedModule {}