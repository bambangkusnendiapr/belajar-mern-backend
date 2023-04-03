import express from "express"
import cors from "cors"
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import fileUpload from "express-fileupload"
import db from "./config/Database.js"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'));
app.use(UserRoute)
app.use(ProductRoute)

try {
  await db.authenticate()
  console.log('Database Connected.....');
} catch (error) {
  console.log(error);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})