import express from "express";
import dotnenv from 'dotenv';
import routes from "./routes.js";
import cors from "cors";
dotnenv.config();
const app = express();
app.use(cors());
app.use('/api/utils', routes);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.listen(process.env.PORT, () => {
    console.log("Utils service is running");
});
