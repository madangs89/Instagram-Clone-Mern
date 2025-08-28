import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import cookieParser from "cookie-parser";
import { messageRouter } from "./routes/message.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { createClient } from "redis";
import { handleBulkRead } from "./controler/message.controler.js";

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.AUTH_BACKEND],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Redis URL:", process.env.REDIS_URL);


export const redis = createClient({
  url: "rediss://default:AVgAAAIjcDEwZWNhMmEzNDViMjE0M2I4OGU5NjUzNzg3MGRmM2UyNHAxMA@crucial-boar-22528.upstash.io:6379",
  // socket: {
  //   tls: true, // enable TLS
  //   rejectUnauthorized: false, // helps avoid local SSL cert issues
  // },
});

redis.on("error", (err) => console.log("Redis Client Error", err));
const subClient = redis.duplicate();
export const pubClient = redis.duplicate();

await redis.connect();
await subClient.connect();
await pubClient.connect();
redis.on("error", (err) => console.log("Redis Client Error", err));

await subClient.subscribe("userOnline", async (data) => {
  console.log(data, "data when user comes online");
  const { userId } = JSON.parse(data);

  const result = await handleBulkRead(userId);
  console.log(result, "result when user comes online");

  pubClient.publish("userComesOnline", JSON.stringify(result));
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/message", messageRouter);
app.use("/message", uploadRouter);
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
