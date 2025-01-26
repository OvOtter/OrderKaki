import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import PostList from "./components/Post/PostsList";

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/posts"
          element={isLoggedIn ? <PostList /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
