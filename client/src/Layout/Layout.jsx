import { Outlet } from "react-router-dom";
import LeftHome from "../components/Deloper/LeftHome";
import Loader from "../components/Deloper/Loader";
import MobileNav from "../components/Deloper/MobileNav";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUnlikedPosts,
  getAllUnlikedStories,
} from "../Redux/Services/mediaFeedThunk";
import { getCurrentUserDetails } from "../Redux/Services/UserThunk";

const Layout = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const data = useSelector((state) => state.auth);
  useEffect(() => {
    (async () => {
      await dispatch(getAllUnlikedPosts());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await dispatch(getAllUnlikedStories());
    })();
  }, []);

  // useEffect(() => {
  //   console.log("get currect user hited", auth);
  //   if (auth && data._id) {
  //     (async () => {
  //       await dispatch(getCurrentUserDetails(data?._id));
  //     })();
  //   }
  // }, [auth]);

  console.log("userData", auth);

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
