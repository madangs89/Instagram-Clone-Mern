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
  async (formData, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/post", formData, {
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
export const addReel = createAsyncThunk(
  "mediaUpload/reel",
  async (formData, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/reel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "response");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const addStory = createAsyncThunk(
  "mediaUpload/story",
  async (formData, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api2.post("/story/create", formData, {
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
export const addComment = createAsyncThunk(
  "mediaUpload/addComment",
  async (data, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/comment", data, {
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
export const getAllComments = createAsyncThunk(
  "mediaUpload/getAllComments",
  async (mediaId, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/comment/${mediaId}`, {
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
export const deleteComment = createAsyncThunk(
  "mediaUpload/delete",
  async (commentId, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.delete(`/comment/${commentId}`, {
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
export const addView = createAsyncThunk(
  "mediaUpload/addView",
  async (data, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(`/reel/view/create`, data, {
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
