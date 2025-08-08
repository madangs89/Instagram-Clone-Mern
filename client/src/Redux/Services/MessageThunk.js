import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_MESSAGE_URL}`,
  withCredentials: true,
});

export const getAllConversationAndGroup = createAsyncThunk(
  "messsage/getAllConversatoin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/message/all`);
      console.log(response.data.data, "response in message thunk");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const addConversation = createAsyncThunk(
  "messsage/addConversation",
  async ({ members }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/message/conversation/create`, {
        members,
      });
      console.log(response.data.conversation, "response in message thunk");

      return response?.data?.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getCurrentUserMessage = createAsyncThunk(
  "message/currentUserMessage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/message/all/messages/${id}`);
      console.log(response.data.messages, "response in message thunk");

      return response?.data?.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/message/create/message", data);
      console.log(response.data.messageData, "response in message thunk");

      return response?.data?.messageData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
