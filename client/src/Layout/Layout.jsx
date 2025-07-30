import { Outlet } from "react-router-dom";
import LeftHome from "../components/Deloper/LeftHome";
import Loader from "../components/Deloper/Loader";
import MobileNav from "../components/Deloper/MobileNav";

const Layout = () => {
  return (
    <div className="h-screen bg-black w-full flex">
      <LeftHome />
      {/* <div className="flex-1 flex h-screen overflow-hidden"> */}
      <MobileNav/>
      <Outlet />
      {/* </div> */}
    </div>
  );
};

export default Layout;
