import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import { authRouter } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/auth", authRouter);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
