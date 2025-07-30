import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

import Layout from "./Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfliePage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkIsAuth } from "./Redux/Services/AuthThunk";

const App = () => {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const data = await dispatch(checkIsAuth());

    })();
  }, []);

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit/:username" element={<EditProfile />} />
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
