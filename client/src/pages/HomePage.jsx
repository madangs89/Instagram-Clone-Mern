import StroyWraper from "../components/Deloper/StroyWraper.jsx";
import LeftHome from "../components/Deloper/LeftHome.jsx";
import PostWrapper from "../components/Deloper/PostWrapper.jsx";
import SuggestionSidebar from "../components/Deloper/SuggestionSidebar.jsx";
import MobileNavTop from "../components/Deloper/MobileNavTop.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIsAuth } from "../Redux/Services/AuthThunk.js";
// import { useEffect } from "react";
// import { checkIsAuth } from "../Redux/Services/AuthThunk.js";

const HomePage = () => {
  const userData = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userData._id) {
      console.log("user data is not there so calling api");
      
      (async () => {
        await dispatch(checkIsAuth());
      })();
    }
  }, [userData._id, dispatch]);
  return (
    <>
      <MobileNavTop />
      <div className="flex-1 mt-12 md:mt-1 bg-black flex h-screen overflow-hidden">
        {/* Main Content Area */}
        <div
          className="flex-1 h-full overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex flex-col md:mt-5 mt-2 w-full max-w-2xl mx-auto px-4 pb-4">
            <StroyWraper />
            <PostWrapper />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="hidden lg:block w-80 border-l border-neutral-800 overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <SuggestionSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
