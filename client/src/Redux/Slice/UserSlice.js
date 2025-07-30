import { createSlice } from "@reduxjs/toolkit";
import { getUser, updateUser } from "../Services/UserThunk";

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
  },
  reducers: {},
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
  },
});

// export const { clearError, setAuthState } = userSlice.actions;
export const userReducer = userSlice.reducer;
