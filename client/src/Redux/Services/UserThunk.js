import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_USER_URL}`,
  withCredentials: true,
});
const apis = axios.create({
  baseURL: `${import.meta.env.VITE_POST_URL}`,
  withCredentials: true,
});
export const getUser = createAsyncThunk(
  "user/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/details/${id}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.patch("/user", formData);
      console.log(response, "response");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);
export const followUser = createAsyncThunk(
  "user/followUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/follow/${id}`);
      console.log(response, "response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);
export const unFollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/unfollow/${id}`);
      console.log(response, "response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);
export const like = createAsyncThunk(
  "user/like",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apis.post(`/like`, data);
      console.log(response, "response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);

export const getPostForProfile = createAsyncThunk(
  "user/getPostforProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apis.get(`/post/posts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getReelForProfile = createAsyncThunk(
  "user/getReelforProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apis.get(`/reel/reels/${id}`);
      console.log(response, "response , reel thunk");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
