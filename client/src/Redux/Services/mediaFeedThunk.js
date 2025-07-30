import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_POST_URL}`,
  withCredentials: true,
});
// const api2 = axios.create({
//   baseURL: `${import.meta.env.VITE_STORY_URL}`,
//   withCredentials: true,
// });
export const getAllUnlikedPosts = createAsyncThunk(
  "mediaFeed/post",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/post");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
