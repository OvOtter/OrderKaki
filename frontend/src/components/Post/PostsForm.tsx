import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/post";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

const PostsForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [building, setBuilding] = useState("Eusoff Hall"); // Default building
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct max_wait_time string (e.g., "2h30m")
    const maxWaitTime = `${hours > 0 ? `${hours}h` : ""}${
      minutes > 0 ? `${minutes}m` : ""
    }`;

    const postData = {
      title,
      platform,
      cuisine,
      description,
      max_wait_time: maxWaitTime, // Send as a formatted string
      building,
    };

    try {
      await createPost(postData); // Call the API to create a post
      alert("Post created successfully!");
      navigate("/posts"); // Redirect to the posts page
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
      padding={3}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="400px"
        padding={3}
        bgcolor="white"
        boxShadow={3}
        borderRadius={2}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Title Input */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="platform-label">Platform</InputLabel>
          <Select
            labelId="platform-label"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value="Grab">Grab</MenuItem>
            <MenuItem value="Deliveroo">Deliveroo</MenuItem>
            <MenuItem value="Foodpanda">Foodpanda</MenuItem>
          </Select>
        </FormControl>

        {/* Cuisine Input */}
        <TextField
          label="Cuisine/Restaurant"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />

        {/* Description Input */}
        <TextField
          label="Description (optional)"
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Maximum Wait Time Inputs */}
        <Box display="flex" flexDirection="column" width="100%" mt={2}>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="left"
            mb={1}
          >
            Set the maximum wait time for your post (e.g., 2 hours and 30
            minutes).
          </Typography>
          <Box display="flex" gap={2} width="100%">
            {/* Hours Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="hours-label">Hours</InputLabel>
              <Select
                labelId="hours-label"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {Array.from({ length: 13 }, (_, h) => (
                  <MenuItem key={h} value={h}>
                    {h} hour{h !== 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Minutes Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="minutes-label">Minutes</InputLabel>
              <Select
                labelId="minutes-label"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              >
                {[0, 15, 30, 45].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m} minute{m !== 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Building Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="building-label">Building</InputLabel>
          <Select
            labelId="building-label"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
            <MenuItem value="Eusoff Hall">Eusoff Hall</MenuItem>
            <MenuItem value="Temasek Hall">Temasek Hall</MenuItem>
            <MenuItem value="Raffles Hall">Raffles Hall</MenuItem>
            <MenuItem value="Kent Ridge Hall">Kent Ridge Hall</MenuItem>
            <MenuItem value="King Edward VII Hall">
              King Edward VII Hall
            </MenuItem>
            <MenuItem value="Sheares Hall">Sheares Hall</MenuItem>
            <MenuItem value="Prince George's Park">
              Prince George's Park
            </MenuItem>
            <MenuItem value="University Town">University Town</MenuItem>
            <MenuItem value="Ridge View Residential College">
              Ridge View Residential College
            </MenuItem>
            {/* Add more buildings here */}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Create Post
        </Button>
      </Box>
    </Box>
  );
};

export default PostsForm;
