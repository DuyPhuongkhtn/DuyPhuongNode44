import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(
    'node44_youtube', //tên database
    'root', // ten user
    '123456', //password user
    {
        host: 'localhost',
        port: 3307,
        dialect: 'mysql'
    }
)

export default sequelize;