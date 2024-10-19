// B1: import lib express
import express from 'express';
import pool from './db.js';
import { OK, INTERNAL_SERVER } from './const.js';
import rootRoutes from './src/routes/root.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// B2: tạo object express
const app = express();

app.use(express.static(".")) // định vị load thư mục tài nguyên

// thêm middleware cors để FE có thể call API tới BE
app.use(cors({
    origin: "http://localhost:3000", // cấp quyền cho FE
    credentials: true // cho phép FE lấy cookie và lưu vào cookie browser
}));
// thêm middleware để đọc data json
app.use(express.json());

// thêm middleware để đọc cookie từ request
app.use(cookieParser());

// import rootRoutes
app.use(rootRoutes);

// B3: define port cho BE chạy
// params 1: define port BE
// params 2: callback function

app.get('/', (req, res) => {
    res.send("Hello node44");
})

app.get('/test', (req, res)=>{
    res.send('test api');
})

// demo get query từ URL
app.get('/test-query', (req, res)=>{
    let query = req.query;
    res.send(query);
})

// demo get header from request

app.get('/test-header', (req, res)=>{
    let headers = req.headers;
    res.send(headers);
});

app.listen(8080, () => {
    console.log("Server is starting with port 8080");
})

// npx sequelize-auto -h localhost -d node44_youtube -u root -x 123456 -p 3307 --dialect mysql -o src/models -l esm