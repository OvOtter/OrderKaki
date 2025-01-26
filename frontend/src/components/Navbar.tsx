import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    alert("Logged out successfully!");
    navigate("/login"); // Redirect to login
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "lightblue", // Light blue navbar background
        color: "black", // Black text color
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "black",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" }, // Underline on hover
            }}
          >
            OrderKaki
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box>
          {isLoggedIn ? (
            <>
              <Button
                component={Link}
                to="/posts"
                sx={{
                  color: "black",
                  border: "1px solid black",
                  textTransform: "none",
                  marginRight: 2,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.1)", // Light hover effect
                  },
                }}
              >
                Posts
              </Button>
              <Button
                component={Link}
                to="/create-post"
                sx={{
                  color: "black",
                  border: "1px solid black",
                  textTransform: "none",
                  marginRight: 2,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.1)", // Light hover effect
                  },
                }}
              >
                Create Post
              </Button>
              <Button
                onClick={handleLogout}
                sx={{
                  color: "black",
                  border: "1px solid black",
                  textTransform: "none",
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.1)", // Light hover effect
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "black",
                  border: "1px solid black",
                  textTransform: "none",
                  marginRight: 2,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.1)", // Light hover effect
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                sx={{
                  color: "black",
                  border: "1px solid black",
                  textTransform: "none",
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.1)", // Light hover effect
                  },
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
