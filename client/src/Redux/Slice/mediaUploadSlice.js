import { createSlice } from "@reduxjs/toolkit";
import { addPost, addReel, addStory } from "../Services/mediaUploadThunk";

const mediaUploadSlice = createSlice({
  name: "mediaUpload",
  initialState: {
    story: { error: null, loading: false, status: "" },
    reel: { error: null, loading: false, status: "" },
    post: { error: null, loading: false, status: "" },
    userStory: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStory.pending, (state) => {
        state.story.loading = true;
        state.story.error = null;
        state.story.status = "uploading";
      })
      .addCase(addStory.fulfilled, (state, action) => {
        state.story.loading = false;
        state.story.error = null;
        state.story.status = "success";
        state.userStory.push(action.payload.data);
      })
      .addCase(addStory.rejected, (state, action) => {
        state.story.loading = false;
        state.story.error = action.payload.message || "Error uploading story";
        state.story.status = "failed";
      });
    builder
      .addCase(addReel.pending, (state) => {
        state.reel.loading = true;
        state.reel.error = null;
        state.reel.status = "uploading";
      })
      .addCase(addReel.fulfilled, (state, action) => {
        state.reel.loading = false;
        state.reel.error = null;
        state.reel.status = "success";
      })
      .addCase(addReel.rejected, (state, action) => {
        state.reel.loading = false;
        state.reel.error = action.payload.message || "Error uploading reel";
        state.reel.status = "failed";
      });
    builder
      .addCase(addPost.pending, (state) => {
        state.post.loading = true;
        state.post.error = null;
        state.post.status = "uploading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.post.loading = false;
        state.post.error = null;
        state.post.status = "success";
      })
      .addCase(addPost.rejected, (state, action) => {
        state.post.loading = false;
        state.post.error = action.payload.message || "Error uploading post";
        state.post.status = "failed";
      });
  },
});

// Exports
export const { clearError, setAuthState } = mediaUploadSlice.actions;
export const mediaUploadReducer = mediaUploadSlice.reducer;
