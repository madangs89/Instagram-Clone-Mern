import { Outlet } from "react-router-dom";
import LeftHome from "../components/Deloper/LeftHome";
import Loader from "../components/Deloper/Loader";
import MobileNav from "../components/Deloper/MobileNav";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUnlikedPosts,
  getAllUnlikedStories,
  getAllUserNotification,
} from "../Redux/Services/mediaFeedThunk";
import { updateTheNotificationCount } from "../Redux/Slice/mediaFeedSlice";
import { getUnReadMessageCount } from "../Redux/Services/MessageThunk";

const Layout = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const data = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket.socket);

  // const data = useSelector((state) => state.auth);
  useEffect(() => {
    (async () => {
      if (!auth) return;
      console.log(data.token, "token from layout");
      await dispatch(getAllUnlikedPosts());
    })();
  }, [auth]);

  useEffect(() => {
    (async () => {
      if (!auth) return;
      await dispatch(getAllUnlikedStories());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getAllUserNotification());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(getUnReadMessageCount());
        console.log(data.payload, "unread message Count");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("newNotification", (data) => {
      console.log("newNotification", data);
      dispatch(updateTheNotificationCount());
    });
  }, [socket]);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-black w-full flex">
      <LeftHome />
      {/* <div className="flex-1 flex h-screen overflow-hidden"> */}
      <MobileNav />
      <Outlet />
      {/* </div> */}
    </div>
  );
};

export default Layout;
