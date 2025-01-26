import React, { useEffect, useState } from "react";
import { fetchPosts, deletePost } from "../../services/post";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

// Helper function to format the timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-SG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [filterBy, setFilterBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err: any) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post[filterBy]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, filterBy, posts]);

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
      <Box display="flex" justifyContent="center" mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" textAlign="center" mb={4}>
        Posts
      </Typography>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel id="filter-by-label">Filter By</InputLabel>
          <Select
            labelId="filter-by-label"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            label="Filter By"
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="platform">Platform</MenuItem>
            <MenuItem value="cuisine">Cuisine</MenuItem>
            <MenuItem value="building">Building</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Post Grid */}
      <Grid container spacing={3}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {post.user_id ===
                parseInt(localStorage.getItem("user_id") || "0") && (
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
                <Typography variant="h6" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.description || "No description provided."}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Building: {post.building}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Expire Time: {formatTimestamp(post.expires_at)}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: "auto" }}>
                <Button
                  size="small"
                  component={Link}
                  to={`/posts/${post.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;
