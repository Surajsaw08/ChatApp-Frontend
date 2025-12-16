import { API_URL } from "@/constants";
import axios from "axios";

export const login = async (
  email: String,
  password: String
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log("found error :", error);

    const msg = error?.response?.data?.msg || "Login failed";
    throw new error(msg);
  }
};

export const register = async (
  email: String,
  password: String,
  name: String,
  avatar?: String | null
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name,
      avatar,
    });
    return response.data;
  } catch (error: any) {
    console.log("found error :", error);

    const msg = error?.response?.data?.msg || "Registration  failed";
    throw new error(msg);
  }
};
