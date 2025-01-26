import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../services/post";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const UpdatePostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [hours, setHours] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch the existing post details
  useEffect(() => {
    const getPost = async () => {
      try {
        if (!id) return;
        const data = await fetchPostById(id);

        setPost(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch post details.");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id || !post) return;

      // Update the post object
      const updatedPost = {
        ...post,
      };

      await updatePost(id, updatedPost); // Send updated post to the backend
      alert("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update post.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        bgcolor: "#f5f5f5",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Update Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={post?.title || ""}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          select
          label="Platform"
          value={post?.platform || ""}
          onChange={(e) => setPost({ ...post, platform: e.target.value })}
          required
        >
          <MenuItem value="Grab">Grab</MenuItem>
          <MenuItem value="Deliveroo">Deliveroo</MenuItem>
          <MenuItem value="Foodpanda">Foodpanda</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Cuisine/Restaurant"
          value={post?.cuisine || ""}
          onChange={(e) => setPost({ ...post, cuisine: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={4}
          value={post?.description || ""}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
        />

        <TextField
          fullWidth
          margin="normal"
          select
          label="Building"
          value={post?.building || ""}
          onChange={(e) => setPost({ ...post, building: e.target.value })}
          required
        >
          <MenuItem value="Eusoff Hall">Eusoff Hall</MenuItem>
          <MenuItem value="Temasek Hall">Temasek Hall</MenuItem>
          <MenuItem value="Raffles Hall">Raffles Hall</MenuItem>
          <MenuItem value="Kent Ridge Hall">Kent Ridge Hall</MenuItem>
          <MenuItem value="King Edward VII Hall">King Edward VII Hall</MenuItem>
          <MenuItem value="Sheares Hall">Sheares Hall</MenuItem>
          <MenuItem value="Prince George's Park">Prince George's Park</MenuItem>
          <MenuItem value="University Town">University Town</MenuItem>
          <MenuItem value="Ridge View Residential College">
            Ridge View Residential College
          </MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Update Post
        </Button>
      </form>
    </Box>
  );
};

export default UpdatePostPage;
