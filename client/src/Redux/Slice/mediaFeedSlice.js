import { createSlice } from "@reduxjs/toolkit";
import { getAllUnlikedPosts } from "../Services/mediaFeedThunk";

const mediaFeedSlice = createSlice({
  name: "mediaFeed",
  initialState: {
    loading: false,
    error: null,
    posts: [],
    reels: [],
    story: [],
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
  },
});

// Exports
// export const { clearError, setAuthState } = mediaFeedSlice.actions;
export const mediaFeedReducer = mediaFeedSlice.reducer;
