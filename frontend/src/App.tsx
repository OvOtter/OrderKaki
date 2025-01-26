import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostListPage from "./pages/PostsListPage";
import PostFormPage from "./pages/PostsFormPage";
import Navbar from "./components/Navbar";
import PostDetailPage from "./pages/PostDetailPage";
import UpdatePostPage from "./pages/UpdatePostPage";

// Function to check if the user is logged in
const isLoggedIn = !!localStorage.getItem("token");

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Navbar (fixed at the top) */}
        <Navbar />

        {/* Main content (takes up the rest of the viewport height) */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Routes>
            {/* Redirect '/' based on login status */}
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? "/posts" : "/login"} />}
            />

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route
              path="/posts"
              element={isLoggedIn ? <PostListPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/create-post"
              element={isLoggedIn ? <PostFormPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/:postId"
              element={
                isLoggedIn ? <PostDetailPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/update-post/:id"
              element={
                isLoggedIn ? <UpdatePostPage /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
