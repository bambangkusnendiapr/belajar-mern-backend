import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

//definisi table, field dan type
const Product = db.define('products', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    freezeTableName: true
})

export default Product;

// (async() => {
//     await db.sync()
// })();