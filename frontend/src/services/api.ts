import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const fetchPosts = async () => {
    const response = await API.get("/posts");
    console.log(response);
    return response.data.data;
};
