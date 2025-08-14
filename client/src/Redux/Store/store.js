import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../Slice/AuthSlice";
import { userReducer } from "../Slice/UserSlice";
import { mediaUploadReducer } from "../Slice/mediaUploadSlice";
import { mediaFeedReducer } from "../Slice/mediaFeedSlice";
import { messageReducer } from "../Slice/MessageSlice";
import { socketReducer } from "../Slice/SocketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    mediaUpload: mediaUploadReducer,
    mediaFeed: mediaFeedReducer,
    message: messageReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"], // ignore this path
      },
    }),
});
