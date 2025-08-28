import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  withCredentials: true,
});
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ userName, password }, { rejectWithValue }) => {
    try {
      console.log("Logging in user:", import.meta.env.VITE_AUTH_URL);
      const response = await api.post("/auth/login", { userName, password });
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        status: error.response?.status,
        response: error.response?.data,
      });
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { userName, password, email, name, publicKey },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", {
        userName,
        password,
        email,
        publicKey,
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
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
