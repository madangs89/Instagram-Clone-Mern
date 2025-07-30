import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/ConnectDB.js";
import cookieParser from "cookie-parser";
import { storyRouter } from "./routes/user.route.js";
dotenv.config({ path: "./.env" });

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL , process.env.USER_BACKEND],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/story" , storyRouter)

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(process.env.PORT, async () => {
  connectDB();
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
