import multer, {diskStorage} from 'multer';

// process.cwd(): trả về đường dẫn root của project
export const upload  = multer({
    storage: diskStorage({
        destination: process.cwd() + "/public/imgs",
        filename: (req, file, callback) => {
            // timestamp_img_name
            let newName = new Date().getTime() + '_' + file.originalname;
            callback(null, newName);
        }
    })
})