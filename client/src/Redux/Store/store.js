import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../Slice/AuthSlice";
import { userReducer } from "../Slice/UserSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
