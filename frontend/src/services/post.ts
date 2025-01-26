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
