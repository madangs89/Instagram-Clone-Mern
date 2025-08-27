import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import { userRouter } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import botRouter from "./routes/bot.route.js";
dotenv.config({ path: "./.env" });

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.AUTH_BACKEND,
      process.env.CLIENT_URL,
      process.env.STORY_BACKEND,
      process.env.MESSAGE_BACKEND,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/bot", botRouter);
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
