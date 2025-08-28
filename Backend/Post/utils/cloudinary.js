// import dotenv from "dotenv";
// dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinarySingle = async (filePath) => {
  try {
    const data = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    const result = await cloudinary.uploader.upload(filePath, {
      // Specify the folder in Cloudinary
      resource_type: "auto", // Automatically determine the resource type
    });
    console.log("Cloudinary upload result:", result);

    return result;
  } catch (error) {
    console.log(error);

    throw new Error("Cloudinary upload failed");
  }
};

export const deleteCloudinaryImage = async (publicId, mediaType) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: mediaType, // use "video" for videos
    });
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads"); // Specify the directory to save uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // keep file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage: storage });
