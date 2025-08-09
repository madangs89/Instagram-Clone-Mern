import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_POST_URL}`,
  withCredentials: true,
});
const api2 = axios.create({
  baseURL: `${import.meta.env.VITE_STORY_URL}`,
  withCredentials: true,
});
export const addPost = createAsyncThunk(
  "mediaUpload/post",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/post", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const addReel = createAsyncThunk(
  "mediaUpload/reel",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reel", formData);
      console.log(response, "response");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const addStory = createAsyncThunk(
  "mediaUpload/story",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api2.post("/story/create", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const addComment = createAsyncThunk(
  "mediaUpload/addComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/comment", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllComments = createAsyncThunk(
  "mediaUpload/getAllComments",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comment/${mediaId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const deleteComment = createAsyncThunk(
  "mediaUpload/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/comment/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
