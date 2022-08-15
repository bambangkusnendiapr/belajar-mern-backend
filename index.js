import express from "express"
import cors from "cors"
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import fileUpload from "express-fileupload"

const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'));
app.use(UserRoute)
app.use(ProductRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})