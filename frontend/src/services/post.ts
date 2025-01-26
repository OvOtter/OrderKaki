import API from "./api";

// Function to fetch posts
export const fetchPosts = async () => {
    try {
        const response = await API.get("/posts");
        return response.data.data; // Assuming backend returns posts in `data`
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to fetch posts");
    }
};

// Function to create a new post
export const createPost = async (postData: any) => {
    const response = await API.post("/posts", postData);
    return response.data;
};

// Fetch a single post by ID
export const fetchPostById = async (postId: string) => {
    const response = await API.get(`/posts/${postId}`);
    return response.data.data; // Assuming the backend returns the post in `data`
};

export const updatePost = async (postId: string, updatedData: any) => {
    const response = await API.put(`/posts/${postId}`, updatedData);
    return response.data;
};

export const deletePost = async (postId: string) => {
    const response = await API.delete(`/posts/${postId}`);
    return response.data;
};