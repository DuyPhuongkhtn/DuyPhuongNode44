import { Inject, Injectable } from "@nestjs/common";
import { UploadApiResponse } from "cloudinary";

@Injectable()
export class UploadService {
    constructor(@Inject('CLOUDINARY') private cloudinary) { }

    async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                { folder },
                (error: any, result: UploadApiResponse | PromiseLike<UploadApiResponse>) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            // Gửi file buffer vào stream để tải lên
            uploadStream.end(file.buffer);
        });
    }

    async uploadImages(files: Express.Multer.File[], folder: string): Promise<UploadApiResponse[]> {
        const uploadPromises = files.map(file => {
          return new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
              { folder },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            uploadStream.end(file.buffer);
          });
        });

        // Chờ tất cả các upload hoàn tất và trả về kết quả
        return Promise.all(uploadPromises);
      }
}