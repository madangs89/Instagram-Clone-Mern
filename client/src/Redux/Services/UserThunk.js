import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_USER_URL}`,
  withCredentials: true,
});
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erorr"
      );
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.patch("/user", formData);
      console.log(response , "response");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating user"
      );
    }
  }
);
