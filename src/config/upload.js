import multer, {diskStorage} from 'multer';

// process.cwd(): trả về đường dẫn gốc của project

export const upload = multer({
    storage: diskStorage({
        destination: process.cwd() + "/public/img",
        filename: (req, file, callback) => { // đổi tên file
            let newName = new Date().getTime() + "_" + file.originalname; // 17442042443 , DD_MM_YYYY_hh_mm_ss_ms
            callback(null, newName)
        }
    })
})