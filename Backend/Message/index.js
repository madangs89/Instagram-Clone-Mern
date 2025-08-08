import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import cookieParser from "cookie-parser";
import { messageRouter } from "./routes/message.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
dotenv.config({ path: "./.env" });

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



app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use("/message" , messageRouter)
app.use("/message" , uploadRouter)
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
