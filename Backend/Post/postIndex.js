import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import likesRouter from "./routes/likes.route.js";
import reelRouter from "./routes/reel.route.js";
import { connectDB } from "./utils/ConnectDB.js";
import commentRouter from "./routes/comment.route.js";
import notificationRouter from "./routes/notification.route.js";
import { createClient } from "redis";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.AUTH_BACKEND],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

export const redis = createClient({
  url: "rediss://default:AVgAAAIjcDEwZWNhMmEzNDViMjE0M2I4OGU5NjUzNzg3MGRmM2UyNHAxMA@crucial-boar-22528.upstash.io:6379",
});
await redis.connect();

redis.on("error", (err) => console.log("Redis Client Error", err));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/post", postRouter);
app.use("/reel", reelRouter);
app.use("/notification", notificationRouter);
app.use("/", likesRouter);

app.use("/comment", commentRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
