import { createSlice } from "@reduxjs/toolkit";
import { checkIsAuth, loginUser, registerUser } from "../Services/AuthThunk";
const authSlice = createSlice({
  name: "auth",
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
    isAuthenticated: false,
    token: null,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Login failed Please Try Again";
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action?.payload?.message || "Registration failed Please Try Again";
      });

    // isAuthenticated
    builder
      .addCase(checkIsAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIsAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userName = action.payload.user.userName;
        state._id = action.payload.user._id;
        state.avatar = action.payload.user.avatar;
        state.token = action.payload.user.token;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(checkIsAuth.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action?.payload?.message || "Failed to check authentication";
      });
  },
});

// Exports
// export const { clearError, setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
