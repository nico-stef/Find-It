import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditProfile from "./pages/EditProfile";
import PostDetails from "./pages/PostDetails";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from './routes/ProtectedRoutes';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<Layout />}>
              <Route path="feed" element={<Home />} />
              <Route path="profil" element={<Profile />} />
              <Route path="editProfile" element={<EditProfile />} />
              <Route path="/post/:id" element={<PostDetails />} />
            </Route>
          </Route>
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
