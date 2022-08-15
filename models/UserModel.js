import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize

//definisi table, field dan type
const User = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
}, {
    freezeTableName: true
})

export default User;

(async() => {
    await db.sync()
})();