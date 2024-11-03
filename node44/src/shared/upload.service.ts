import { diskStorage } from 'multer';
import {extname} from 'path';

export const getStorageOptions = (destination: string) => {
    return diskStorage({
        destination: `./public/imgs/${destination}`,
        filename: (req, file, callback) => {
            const uniqueName = Date.now();
            callback(null, `${uniqueName}${extname(file.originalname)}`); // => 3123124234356.png
        }
    })
}