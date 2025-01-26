import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to /posts if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/posts");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
        alert("Login successful!");
        navigate("/posts");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh" // Full-screen height
      bgcolor="#f5f5f5" // Light gray background
      padding={3}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="300px" // Fixed width for the form
        padding={3}
        bgcolor="white" // White background for the form
        boxShadow={3} // Add some shadow
        borderRadius={2} // Rounded corners
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {/* Username Input */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password Input */}
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 2 }} // Add margin-top
        >
          Login
        </Button>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Login;
