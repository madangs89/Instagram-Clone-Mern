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
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/user/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getCurrentUserDetails = createAsyncThunk(
  "user/getCurrentUserDetails",
  async (id, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/user/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "response");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.patch("/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);
export const followUser = createAsyncThunk(
  "user/followUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(
        `/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error following user");
    }
  }
);

export const unFollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(
        `/user/unfollow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

export const like = createAsyncThunk(
  "user/like",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apis.post(`/like`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);

export const getPostForProfile = createAsyncThunk(
  "user/getPostforProfile",
  async (id, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apis.get(`/post/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getReelForProfile = createAsyncThunk(
  "user/getReelforProfile",
  async (id, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apis.get(`/reel/reels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getSugestedUser = createAsyncThunk(
  "user/getSugestedUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/user/sugested/users/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "response , sugested Users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (name, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(
        `/user/get/search/users/data?userName=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getFollowAndFollowingUsers = createAsyncThunk(
  "user/getFollowAndFollowingUsers",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(
        `/user/get/user/data/followers/following/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
