import API from "./api";

// Function for logging in a user
export const login = async (username: string, password: string) => {
    try {
        const response = await API.post("/login", { username, password });
        const token = response.data.token;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        return { success: true, token };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.error || "Login failed" };
    }
};

// Function for signing up a user
export const signup = async (username: string, password: string) => {
    try {
        const response = await API.post("/signup", { username, password });
        return { success: true, message: "Signup successful" };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.error || "Signup failed" };
    }
};
