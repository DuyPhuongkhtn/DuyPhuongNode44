// B1: import lib express
import express from 'express';
import pool from './db.js';
import { OK, INTERNAL_SERVER } from './const.js';
import rootRoutes from './src/routes/root.router.js';

// B2: tạo object express
const app = express();

// thêm middleware để đọc data json
app.use(express.json());

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