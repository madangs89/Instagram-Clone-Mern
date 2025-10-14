import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Layout from "./Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfliePage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkIsAuth } from "./Redux/Services/AuthThunk";
import Upload from "./pages/Upload";
import { getCurrentUserDetails, getUser } from "./Redux/Services/UserThunk";
import ReelsPage from "./pages/ReelsPage";
import StoryPage from "./pages/StoryPage";
import MessagePage from "./pages/MessagePage";
import ExplorePage from "./pages/ExplorePage";

import Searchpage from "./pages/Searchpage";
import ExploreDetailsPage from "./pages/ExploreDetailsPage";
import NotificationsPage from "./pages/NotificationsPage";
import { clearSocket, setSocket } from "./Redux/Slice/SocketSlice";
import { handleIncreaseMessageCount } from "./Redux/Slice/MessageSlice";
import FullPageLoader from "./components/Deloper/FullPageLoader";

const App = () => {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    if (!auth) {
      setLoading(true);
      (async () => {
        await dispatch(checkIsAuth());
        console.log(data.token, "token from app.jsx");
        setLoading(false);
      })();
    }
  }, []);



  useEffect(() => {
    if (auth && data._id) {
      (async () => {
        await dispatch(getUser(data?._id));
        await dispatch(getCurrentUserDetails(data?._id));
      })();
    }
  }, [auth, data._id, dispatch]);

  useEffect(() => {
    if (auth && data._id) {
      const socket = io("https://instagram-clone-mern-socket.onrender.com", {
        query: {
          userId: data._id,
        },
      });
      dispatch(setSocket(socket));
      return () => {
        socket.emit("removeUser", { userId: data._id });
      };
    }
  }, [auth, data._id]);
  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      dispatch(handleIncreaseMessageCount(data));
    });

    return () => {
      socket.off("message");
      socket.emit("removeUser", { userId: data._id });
    };
  }, [socket]);

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <Router>
      <Routes>
        {/* Public route for login/signup */}
        {!auth && <Route path="/auth" element={<AuthPage />} />}
        {!auth && <Route path="*" element={<Navigate to="/auth" />} />}
        {/* Protected layout and routes */}
        {auth && (
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/edit/:username" element={<EditProfile />} />
            <Route path="/create" element={<Upload />} />
            <Route path="/search" element={<Searchpage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/story/:id" element={<StoryPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/explore/:type/:id" element={<ExploreDetailsPage />} />
            <Route path="/message/*" element={<MessagePage />} />
            {/* <Route path="messages" element={<Messages />} /> */}
            {/* Add more pages here */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;
