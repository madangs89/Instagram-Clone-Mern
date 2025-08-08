import { createSlice, current } from "@reduxjs/toolkit";
import {
  addConversation,
  createMessage,
  getAllConversationAndGroup,
  getCurrentUserMessage,
} from "../Services/MessageThunk";
const messageSlice = createSlice({
  name: "message",
  initialState: {
    allConversationsAndGroups: [],
    selectedIndex: {},
    currentUserMessage: [],
    loading: false,
    loading2: false,
    error: null,
  },
  reducers: {
    rechangeInbox: (state, action) => {
      const { userId, conversationId } = action.payload;
      state.allConversationsAndGroups.forEach((data) => {
        if (data._id == userId) {
          data.conversationId = conversationId;
        }
      });
    },
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllConversationAndGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllConversationAndGroup.fulfilled, (state, action) => {
        state.allConversationsAndGroups = action.payload;
      })
      .addCase(getAllConversationAndGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(addConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(getCurrentUserMessage.pending, (state) => {
        state.loading2 = true;
        state.error = null;
      })
      .addCase(getCurrentUserMessage.fulfilled, (state, action) => {
        state.loading2 = false;
        state.error = null;
        state.currentUserMessage = action.payload;
      })
      .addCase(getCurrentUserMessage.rejected, (state, action) => {
        state.loading2 = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload, "action.payload");
        state.currentUserMessage.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
  },
});

// Exports
export const { rechangeInbox, setSelectedIndex } = messageSlice.actions;
export const messageReducer = messageSlice.reducer;
