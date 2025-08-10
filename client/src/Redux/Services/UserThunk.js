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
export const getCurrentUserDetails = createAsyncThunk(
  "user/getCurrentUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/details/${id}`);
      console.log(response, "response");
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

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getSugestedUser = createAsyncThunk(
  "user/getSugestedUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/sugested/users/data`);
      console.log(response, "response , sugested Users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (name, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/user/get/search/users/data?userName=${name}`
      );
      console.log(response, "response , sugested Users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
