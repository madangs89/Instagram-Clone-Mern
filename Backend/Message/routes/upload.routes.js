import express from "express";
import { upload } from "../utils/cloudinary.js";
import { uploadToClodinary } from "../controler/file.upload.controlers.js";

export const uploadRouter = express.Router();

uploadRouter.post("/upload/files", upload.single("media"), uploadToClodinary);
