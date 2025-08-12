import { createSlice } from "@reduxjs/toolkit";
import {
  curretStoryView,
  getAllUnlikedPosts,
  getAllUnlikedReels,
  getAllUnlikedStories,
  getAllUserNotification,
  markTheNotificationAsRead,
  veiwStory,
} from "../Services/mediaFeedThunk";

const mediaFeedSlice = createSlice({
  name: "mediaFeed",
  initialState: {
    loading: false,
    error: null,
    posts: [],
    reels: [],
    story: [],
    notifications: [],
    notificationsUnreadCount: 0,
    curretStoryView: [],
    filteredStory: [],
  },

  reducers: {
    addFilteredStory: (state, action) => {
      state.filteredStory = action.payload;
    },
    updateStoryView: (state, action) => {
      state.filteredStory.forEach((item) => {
        if (item.userId === action.payload.userId) {
          item.media.forEach((media) => {
            if (media.storyId === action.payload.storyId) {
              media.seen = true;
            }
          });
        }
      });
      const data = state.filteredStory
        .map((item) =>
          item.media
            .filter((media) => media.seen)
            .map((media) => ({
              userId: item.userId,
              storyId: media.storyId,
              media: media.url, // Use media.url instead of item.expiresAt unless you intend otherwise
              seen: true,
              expiresAt: media.expiresAt, // Optional: if you want to include
            }))
        )
        .flat();

      localStorage.setItem("viewedStories", JSON.stringify(data));
    },
    resetStoryView: (state) => {
      state.curretStoryView = [];
    },

    addToStoryUpdate: (state, action) => {
      const { currentUserId, ...newStory } = action.payload;

      // Replace story array (to force UI update)
      state.story = [...state.story, newStory];

      const newMediaItem = {
        url: newStory.mediaUrl,
        seen: false,
        mediaType: newStory.mediaType,
        storyId: newStory._id,
        createdAt: newStory.createdAt,
        expiresAt: newStory.expiresAt,
      };

      const userIndex = state.filteredStory.findIndex(
        (item) => item.userId == currentUserId
      );

      if (userIndex !== -1) {
        const existingUser = state.filteredStory[0];
        const updatedUser = {
          ...existingUser,
          media: [newMediaItem, ...existingUser.media],
          createdAt: newStory.createdAt,
          currentIndex: 0,
        };
        state.filteredStory.splice(userIndex, 1);
        state.filteredStory.unshift(updatedUser);
      } else {
        const newUserStory = {
          userId: newStory.userId,
          currentIndex: 0,
          userName: newStory.userSnapshot?.userName || "",
          avatar: newStory.userSnapshot?.avatar || "",
          createdAt: newStory.createdAt,
          media: [newMediaItem],
          isSelf: newStory.userId === currentUserId,
        };
        state.filteredStory.unshift(newUserStory);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUnlikedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUnlikedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload.posts;
      })
      .addCase(getAllUnlikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(getAllUnlikedReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUnlikedReels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reels = action.payload.reels;
      })
      .addCase(getAllUnlikedReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(getAllUnlikedStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUnlikedStories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.story = action.payload.data;
      })
      .addCase(getAllUnlikedStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(veiwStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(veiwStory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(veiwStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(curretStoryView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(curretStoryView.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.curretStoryView = action.payload?.story[0]?.viewers;
      })
      .addCase(curretStoryView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(getAllUserNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notifications = action.payload.notifications;
      })
      .addCase(getAllUserNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
    builder
      .addCase(markTheNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markTheNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.notifications = action.payload.notifications;
        const notificationId = action.payload.id;
        state.notifications.forEach((notification) => {
          if (notification._id === notificationId) {
            notification.isRead = true;
          }
        });
      })
      .addCase(markTheNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching posts";
      });
  },
});
// Exports
export const {
  addFilteredStory,
  updateStoryView,
  resetStoryView,
  addToStoryUpdate,
} = mediaFeedSlice.actions;
export const mediaFeedReducer = mediaFeedSlice.reducer;
