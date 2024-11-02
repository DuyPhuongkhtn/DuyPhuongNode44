import {diskStorage} from 'multer';
import {extname} from 'path';

export const getStorageOptions = (destination: string) => {
    return diskStorage({
        destination: `./public/imgs/${destination}`,
        filename: (req, file, cb) => {
            const uniqueName = Date.now();
            cb(null, `${uniqueName}${extname(file.originalname)}`);
        }
    })
}