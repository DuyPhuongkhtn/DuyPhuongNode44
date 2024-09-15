import mysql from'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost', // địa chỉ host của MYSQL dưới local
    user: 'root', //  tên người dùng
    password: '123456',  // mật khẩu người dùng
    database: 'node44',
    port: 3307
});

export default pool;