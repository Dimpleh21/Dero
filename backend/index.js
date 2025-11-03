import express from "express";
import cors from "cors";
import rootRouter from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);
