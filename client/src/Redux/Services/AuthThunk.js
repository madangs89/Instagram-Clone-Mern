import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_URL}`,
  withCredentials: true,
});
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ userName, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { userName, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userName, password, email, name }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        userName,
        password,
        email,
        name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const checkIsAuth = createAsyncThunk(
  "auth/checkIsAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/isAuth");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check authentication"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
