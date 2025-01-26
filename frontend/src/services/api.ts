import axios from "axios";

// Create an Axios instance
const API = axios.create({
    baseURL: "http://localhost:8000", // Replace with your backend URL
});

// Add a request interceptor to include the JWT token in every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Get JWT token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
