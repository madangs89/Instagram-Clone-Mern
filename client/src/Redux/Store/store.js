import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../Slice/AuthSlice";
import { userReducer } from "../Slice/UserSlice";
import { mediaUploadReducer } from "../Slice/mediaUploadSlice";
import { mediaFeedReducer } from "../Slice/mediaFeedSlice";
import { messageReducer } from "../Slice/MessageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    mediaUpload: mediaUploadReducer,
    mediaFeed: mediaFeedReducer,
    message :messageReducer
  },
});
