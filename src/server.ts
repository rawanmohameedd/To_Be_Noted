import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"; 
import connectDB from "./config/db";

dotenv.config(); 

const app = express()

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT , ()=> {
    console.log(`Server is running on port: ${process.env.PORT}`)
})
connectDB()