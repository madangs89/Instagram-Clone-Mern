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
export const getAllUnlikedReels = createAsyncThunk(
  "mediaFeed/reels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reel");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllUnlikedStories = createAsyncThunk(
  "mediaFeed/stories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api2.get("/story");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const veiwStory = createAsyncThunk(
  "mediaFeed/viewStory",
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await api2.patch(`/story/update/${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const curretStoryView = createAsyncThunk(
  "mediaFeed/curretStoryView",
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await api2.get(`/story/views/${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getReelById = createAsyncThunk(
  "mediaFeed/getReelById",
  async (reelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reel/get/reel/${reelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getPostById = createAsyncThunk(
  "mediaFeed/getPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/post/get/post/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
