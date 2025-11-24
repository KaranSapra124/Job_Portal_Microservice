import express from "express";
import dotenv from 'dotenv'
import userRoutes from "./Routes/user.js"
import cors from "cors"
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/user", userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`User service is running ${process.env.PORT}`)
})