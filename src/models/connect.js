import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(
    'node44', //têm database
    'root', // ten user
    '123456', //password user
    {
        host: 'localhost',
        port: 3307,
        dialect: 'mysql'
    }
)

export default sequelize;