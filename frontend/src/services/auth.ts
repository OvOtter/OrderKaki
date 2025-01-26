import API from "./api";
import { jwtDecode } from "jwt-decode";

// Function for logging in a user
export const login = async (username: string, password: string) => {
    const response = await API.post("/login", { username, password });
  
    const { token } = response.data;
  
    // Decode the token to extract user_id
    const decoded: { user_id: number } = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", decoded.user_id.toString()); // Store user_id in localStorage
  
    return response.data;
  };

// Function for signing up a user
export const signup = async (username: string, password: string) => {
    try {
        const response = await API.post("/signup", { username, password });
        return { success: true, message: "Signup successful" };
    } catch (error: any) {
        throw error;
    }
};
