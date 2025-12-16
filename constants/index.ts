import { Platform } from "react-native";
// export const API_URL = "http://10.192.104.22:3000";

export const API_URL =
  Platform.OS == "android"
    ? "http://10.192.104.22:3000"
    : "http://localhost:3000";
