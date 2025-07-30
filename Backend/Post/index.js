import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import likesRouter from "./routes/likes.route.js";
import reelRouter from "./routes/reel.route.js";
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/post" , postRouter)
app.use("/reel" , reelRouter)
app.use("/" , likesRouter)
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
