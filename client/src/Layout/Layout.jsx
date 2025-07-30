import { Outlet } from "react-router-dom";
import LeftHome from "../components/Deloper/LeftHome";
import Loader from "../components/Deloper/Loader";
import MobileNav from "../components/Deloper/MobileNav";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllUnlikedPosts } from "../Redux/Services/mediaFeedThunk";

const Layout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const data = await dispatch(getAllUnlikedPosts());
      console.log(data, "data");
    })();
  }, []);
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
