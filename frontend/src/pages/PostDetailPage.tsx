import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../services/post";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Extract the post ID from the URL
  const [post, setPost] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  console.log(localStorage);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        alert("Post deleted successfully.");
        navigate("/posts"); // Redirect after deletion
      } catch (err: any) {
        alert(err.response?.data?.error || "Failed to delete post.");
      }
    }
  };
  useEffect(() => {
    const getPost = async () => {
      try {
        if (!postId) return;
        const data = await fetchPostById(postId);
        setPost(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch post details.");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [postId]);

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

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6">Post not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          boxShadow: 3,
          padding: 2,
        }}
      >
        {post.user_id === parseInt(localStorage.getItem("user_id") || "0") && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/update-post/${post.id}`)}
            >
              Update
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </Button>
          </Box>
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign="center">
            Post Details
          </Typography>
          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Platform:</strong> {post.platform || "Not specified"}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Cuisine:</strong> {post.cuisine || "Not specified"}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Description:</strong>{" "}
            {post.description || "No description provided."}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Building:</strong> {post.building}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Maximum Wait Time:</strong> {post.max_wait_time}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Expires At:</strong>{" "}
            {new Date(post.expires_at).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/posts")}
      >
        Back to Posts
      </Button>
    </Box>
  );
};

export default PostDetailPage;
