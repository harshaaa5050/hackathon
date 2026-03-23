import api from "@/lib/api";

export const registerUser = async (data) => {
  try {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};