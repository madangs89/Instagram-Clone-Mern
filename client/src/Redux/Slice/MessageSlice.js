import { createSlice } from "@reduxjs/toolkit";
import {
  addConversation,
  createMessage,
  getAllConversationAndGroup,
  getAllMessageReaction,
  getCurrentUserMessage,
  removeMessageReaction,
} from "../Services/MessageThunk";
const messageSlice = createSlice({
  name: "message",
  initialState: {
    allConversationsAndGroups: [],
    selectedIndex: {},
    currentUserMessage: [],
    currentMesageAllReactions: [],
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
    clearSelectedCurrentUserMessage: (state) => {
      state.currentUserMessage = [];
    },
    updateCurrentUserMessage: (state, action) => {
      console.log(action.payload, "Checking for upadting the index");
      state.allConversationsAndGroups.forEach((data) => {
        if (data?.conversationId == action.payload.conversationId) {
          data.lastMessage = action.payload.text
            ? action.payload.text
            : "A message has been sent";
          data.lastMessageTime = Date.now();
        }
      });

      state.currentUserMessage.push(action.payload);
    },
    updatingStatusForMessages: (state, action) => {
      const { newStatus, tempId, realMessageId } = action.payload;
      const index = state.currentUserMessage.findIndex(
        (item) => item.tempId == tempId
      );
      if (index !== -1) {
        state.currentUserMessage[index].status.forEach((item) => {
          item.state = newStatus;
        });
        if (realMessageId) {
          state.currentUserMessage[index]._id = realMessageId;
        }
      }
    },
    updateMessageReactionEmoji: (state, action) => {
      const { emoji, messageId, userId } = action.payload;
      console.log(emoji, messageId, userId + "emoji");

      const index = state.currentUserMessage.findIndex(
        (item) => (item._id || item.tempId) == messageId
      );
      if (index !== -1) {
        // state.currentUserMessage[index].reactions.push({ userId, emoji });

        const isUserPresent = state.currentUserMessage[index].reactions.some(
          (reaction) => reaction.userId == userId
        );
        if (isUserPresent) {
          state.currentUserMessage[index].reactions.forEach((reaction) => {
            if (reaction.userId == userId) {
              reaction.emoji = emoji;
            }
          });
        } else {
          state.currentUserMessage[index].reactions.push({ userId, emoji });
        }
      }
    },
    updateMessageReaction: (state, action) => {
      state.currentMesageAllReactions = state.currentMesageAllReactions.filter(
        (item) => item.userId != action.payload.userId
      );
      const isMessageThere = state.currentUserMessage.findIndex(
        (msg) => msg._id == action.payload.messageId
      );
      if (isMessageThere != -1) {
        state.currentUserMessage[isMessageThere].reactions =
          state.currentUserMessage[isMessageThere].reactions.filter(
            (item) => item.userId != action.payload.userId
          );
      }
    },
    updateAllConversationAndGroup: (state, action) => {
      const index = state.allConversationsAndGroups.findIndex(
        (item) => item._id == action.payload._id
      );
      console.log("Called teh function ", action.payload, index);
      if (index == -1) {
        state.allConversationsAndGroups.push(action.payload);
      }
    },
    updateUpSideDownTheAllConversationsAndGroups: (state, action) => {
      const { payload: conversationId } = action;
      const index = state.allConversationsAndGroups.findIndex(
        (conv) => conv.conversationId === conversationId
      );

      // If conversation not found or already on top, do nothing
      if (index <= 0) return;

      const [targetConversation] = state.allConversationsAndGroups.splice(
        index,
        1
      );
      state.allConversationsAndGroups.unshift(targetConversation);
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
        // state.currentUserMessage = [
        //   ...action.payload,
        //   ...state.currentUserMessage,
        // ];
        state.currentUserMessage.unshift(...action.payload);
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
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(getAllMessageReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMessageReaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload, "action.payload");
        state.currentMesageAllReactions = action.payload.data;
      })
      .addCase(getAllMessageReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(removeMessageReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMessageReaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload, "action.payload");
        state.currentMesageAllReactions =
          state.currentMesageAllReactions.filter(
            (item) => item.userId != action.payload.userId
          );
        const isMessageThere = state.currentUserMessage.findIndex(
          (msg) => msg._id == action.payload.messageId
        );

        if (isMessageThere !== -1) {
          state.currentUserMessage[isMessageThere].reactions =
            state.currentUserMessage[isMessageThere].reactions.filter(
              (item) => item.userId != action.payload.userId
            );
        }
      })
      .addCase(removeMessageReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
  },
});

// Exports
export const {
  rechangeInbox,
  setSelectedIndex,
  updateCurrentUserMessage,
  updatingStatusForMessages,
  updateUpSideDownTheAllConversationsAndGroups,
  clearSelectedCurrentUserMessage,
  updateMessageReactionEmoji,
  updateAllConversationAndGroup,
} = messageSlice.actions;
export const messageReducer = messageSlice.reducer;
