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
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get("/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllUnlikedReels = createAsyncThunk(
  "mediaFeed/reels",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get("/reel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllUnlikedStories = createAsyncThunk(
  "mediaFeed/stories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api2.get("/story", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const veiwStory = createAsyncThunk(
  "mediaFeed/viewStory",
  async (storyId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api2.patch(`/story/update/${storyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const curretStoryView = createAsyncThunk(
  "mediaFeed/curretStoryView",
  async (storyId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api2.get(`/story/views/${storyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getReelById = createAsyncThunk(
  "mediaFeed/getReelById",
  async (reelId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/reel/get/reel/${reelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getPostById = createAsyncThunk(
  "mediaFeed/getPostById",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/post/get/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllUserNotification = createAsyncThunk(
  "mediaFeed/getAllUserNotification",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const markTheNotificationAsRead = createAsyncThunk(
  "mediaFeed/markTheNotificationAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.patch(`/notification/read/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
