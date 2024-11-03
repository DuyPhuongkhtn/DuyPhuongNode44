import { Inject, Injectable } from "@nestjs/common";
import { UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudUploadService {
    constructor(@Inject('CLOUDINARY') private cloudinary){}

    async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                // define folder trên cloudinary để lưu hình
                {folder},
                // param 2: tiến hành upload hình lên cloudinary
                (error: any, result: UploadApiResponse) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(file.buffer);
        })
    }
}

// @Injectable()
// export class CatService {
//     getCats() {
//         return ["Tam the", "Meo mun"]
//     }
// }

// @Injectable()
// export class DogService {
//     getDog() {
//         return ["Cho Dom", "Cho muc"]
//     }
// }

// @Injectable()
// export class AnimalService {
//     constructor(
//         @Inject(CatService) private catService: CatService,
//         @Inject(DogService) private dogService: DogService
//     ){}

//     getAllAnimals() {
//         const cats = this.catService.getCats();
//         const dogs = this.dogService.getDog();
//     }
// }