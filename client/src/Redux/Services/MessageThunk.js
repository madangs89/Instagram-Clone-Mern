import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_MESSAGE_URL}`,
  withCredentials: true,
});

export const getAllConversationAndGroup = createAsyncThunk(
  "messsage/getAllConversatoin",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/message/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data, "response in message thunk");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const addConversation = createAsyncThunk(
  "messsage/addConversation",
  async ({ members }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(
        `/message/conversation/create`,
        {
          members,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.conversation, "response in message thunk");

      return response?.data?.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getCurrentUserMessage = createAsyncThunk(
  "message/currentUserMessage",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/message/all/messages/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.messages, "response in message thunk");

      return response?.data?.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/message/create/message", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.messageData, "response in message thunk");

      return response?.data?.messageData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const uploadMediatoClodinary = createAsyncThunk(
  "message/uploadMediatoClodinary",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/message/upload/files", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data, "response in message thunk");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const addReactions = createAsyncThunk(
  "message/addReactions",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post("/message/add/reactions", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, "response in message thunk");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getAllMessageReaction = createAsyncThunk(
  "message/getAllMessageReaction",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(
        `/message/all/reactions/${data.messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "response in message thunk");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const removeMessageReaction = createAsyncThunk(
  "message/removeMessageReaction",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.delete(`/message/delete/reactions`, {
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, "response in message thunk");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
export const getConversationByUserId = createAsyncThunk(
  "message/getConversationByUserId",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(`/message/get/conversation`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);

export const markAllChatsAsRead = createAsyncThunk(
  "message/markAllChatsAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(
        `/message/markAsRead/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const getUnReadMessageCount = createAsyncThunk(
  "message/getUnReadMessageCount",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/message/unreadChatsCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erorr");
    }
  }
);
