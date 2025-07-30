import { createSlice } from "@reduxjs/toolkit";
import {
  followUser,
  getPostForProfile,
  getReelForProfile,
  getUser,
  like,
  unFollowUser,
  updateUser,
} from "../Services/UserThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userName: null,
    _id: null,
    avatar: null,
    name: null,
    email: null,
    bio: null,
    followers: null,
    following: null,
    loading: false,
    error: null,
    gender: null,
    website: null,
    isMuted: true,
    userLikes: [],
    userPosts: [],
    userReels: [],
  },
  reducers: {
    setMuted(state) {
      state.isMuted = !state.isMuted;
    },
    addAndRemoveFollower(state, action) {
      if (state.following.includes(action.payload)) {
        state.followers = state.followers.filter((id) => id != action.payload);
        state.following = state.following.filter((id) => id !== action.payload);
      } else {
        state.followers.push(action.payload);
        state.following.push(action.payload);
      }
    },
    addAndRemoveLike(state, action) {
      if (state.userLikes.includes(action.payload)) {
        state.userLikes = state.userLikes.filter((id) => id != action.payload);
      } else {
        state.userLikes.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.userName;
        state._id = action.payload._id;
        state.avatar = action.payload.avatar;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.bio = action.payload.bio;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
        state.gender = action.payload.gender;
        state.website = action.payload.website;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch user data";
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.user.userName;
        state._id = action.payload.user._id;
        state.avatar = action.payload.user.avatar;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.bio = action.payload.user.bio;
        state.followers = action.payload.user.followers;
        state.following = action.payload.user.following;
        state.gender = action.payload.user.gender;
        state.website = action.payload.user.website;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch user data";
      });

    builder.addCase(followUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(followUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(followUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "Failed to fetch user data";
    });
    builder.addCase(unFollowUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(unFollowUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(unFollowUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "Failed to fetch user data";
    });
    builder.addCase(like.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(like.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(like.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "Failed to fetch user data";
    });
    builder.addCase(getPostForProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPostForProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userPosts = action.payload.posts;
    });
    builder.addCase(getPostForProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "Failed to fetch user data";
    });
    builder.addCase(getReelForProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getReelForProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userReels = action.payload.reels;
    });
    builder.addCase(getReelForProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "Failed to fetch user data";
    });
  },
});

export const { setMuted, addAndRemoveFollower, addAndRemoveLike } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
