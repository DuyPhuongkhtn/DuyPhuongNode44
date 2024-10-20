// B1: import lib express
import express from 'express';
import pool from './db.js';
import { OK, INTERNAL_SERVER } from './const.js';
import rootRoutes from './src/routes/root.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io'; // lib socketIO dùng để tạo Server chat realtime
import {createServer} from 'http';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// B2: tạo object express
const app = express();

// define middleware để public folder public
app.use(express.static("."));

// thêm middleware cors để FE có thể call API tới BE
app.use(cors({
    origin: "http://localhost:3001", // cấp quyền cho FE
    credentials: true // cho phép FE lấy cookie và lưu vào cookie browser
}));


const server = createServer(app); // server nhưng chưa phải server của socketIO
// thêm middleware để đọc data json

// B3: tạo http server
// tạo socketIO server
// io: object của socket server
// socket: object của socket client
const io = new Server(server, {
    cors: {
        origin: "*"
    }
}); // mapping server với socketIO => SocketIO server

// lắng nghe event kết nối từ client (FE) qua SocketIO
// on: nhận event
// emit: gửi event đi
// on và emit có 2 params:
// param 1: event type: event của socketIO hoặc event của user tự define
// param 2: function
let number = 0; // đặt biến toàn cục
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on("send-click", () => {
        console.log("FE send click");
        number = number + 1;
        // server bắn event cho tất cả client
        io.emit("send-new-number", number);
    });

    // nhận event reduce-number
    socket.on("reduce-number", () => {
        number = number - 1;
        io.emit("send-new-number", number);

    })

    // nhận event send-mess
    socket.on("send-mess",async ({user_id, content}) => {
        let newChat = {
            user_id,
            content,
            date: new Date()
        };
        // lưu chat vào database
        await prisma.chat.create({data: newChat});

        // server bắn event cho tất cả client
        io.emit("sv-send-mess", {user_id, content});
    })
})

// BE sẽ nhận event từ FE client


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

server.listen(8080, () => {
    console.log("Server is starting with port 8080");
})

// express không support trực tiếp socketIO mà phải cài lib socket.io
// npx sequelize-auto -h localhost -d node44_youtube -u root -x 123456 -p 3307 --dialect mysql -o src/models -l esm