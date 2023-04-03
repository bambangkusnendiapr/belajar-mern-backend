import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize

//definisi table, field dan type
const User = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password:DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
}, {
    freezeTableName: true
})

export default User;

// (async() => {
//     await db.sync()
// })();