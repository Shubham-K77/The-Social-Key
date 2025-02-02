import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import UserProfile from "./pages/UserProfile";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import FeedPage from "./pages/FeedPage";
import UpdateProfile from "./pages/UpdateProfile";
import DashBoard from "./pages/DashBoard";
import Chat from "./pages/Chat";
const App = () => {
  return (
    <Routes>
      {/* Static Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<FeedPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/update" element={<UpdateProfile />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/chat" element={<Chat />} />
      {/* Dynamic Routes */}
      <Route path="/:username" element={<UserProfile />} />
      <Route path="/:username/post/:pid" element={<PostPage />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
