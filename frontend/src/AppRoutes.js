import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { useAuth } from "./context/auth";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

const AppRoutes = () => {
  const { auth } = useAuth();
  return (
    <Routes>
      <Route path="/" element={!auth ? <Login /> : <Dashboard />} />
      <Route
        path="/signup"
        element={auth ? <Navigate to="/" /> : <Register />}
      />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newPost" element={<NewPost />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/editPost/:postId" element={<EditPost />} />
        <Route path="profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
