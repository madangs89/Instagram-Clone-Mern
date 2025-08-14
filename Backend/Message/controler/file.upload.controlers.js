import { uploadToCloudinarySingle } from "../utils/cloudinary.js";
import fs from "fs";
export const uploadToClodinary = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    // console.log(file.mimetype, file.size, file.path);
    const data = await uploadToCloudinarySingle(file.path);
    const responseData = {
      publicId: data.public_id,
      url: data.secure_url,
      type: [data.resource_type],
    };
    fs.unlinkSync(file.path);
    res.status(200).json({
      message: "File uploaded successfully",
      data: responseData,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
