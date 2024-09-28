import {Sequelize} from 'sequelize';
import configDb from '../config/connect_db.js'

const sequelize = new Sequelize(
    configDb.database, //tên database
    configDb.user, // ten user
    configDb.pass, //password user
    {
        host: configDb.host,
        port: configDb.port,
        dialect: configDb.dialect
    }
)

export default sequelize;