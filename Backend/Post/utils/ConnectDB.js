import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      dbName: "Instagram",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
