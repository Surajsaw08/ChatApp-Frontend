import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// { changed code }
import * as jwtDecodeModule from "jwt-decode";
const jwtDecode =
  ((jwtDecodeModule as any).default || jwtDecodeModule).jwtDecode ||
  (jwtDecodeModule as any).default ||
  jwtDecodeModule;
// ...existing code...
import { login, register } from "@/services/authService";
import { connectSocket, disconnectSocket } from "@/socket/socket";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const decode = jwtDecode(storedToken) as DecodedTokenProps;

        if (decode.exp && decode.exp * 1000 < Date.now()) {
          await AsyncStorage.removeItem("token");
          goToWelcome();
          return;
        }
        await connectSocket();
        setToken(storedToken);
        setUser(decode.user);
        console.log("went to home ", decode.user);
        goToHomePage();
      } catch (error) {
        goToWelcome();
        console.error("Failed to decode JWT:", error);
      }
    } else {
      goToWelcome();
    }
  };

  const goToWelcome = () => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
  };

  const goToHomePage = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };

  const updateToken = async (token: string | null) => {
    if (!token) {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem("token");
      return;
    }

    setToken(token);
    await AsyncStorage.setItem("token", token);

    let decoded: DecodedTokenProps;
    try {
      decoded = jwtDecode(token) as DecodedTokenProps;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return;
    }

    console.log("Decoded JWT:", decoded);
    setUser(decoded.user);
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    if (!response?.token) throw new Error("No token returned from server");
    await updateToken(response.token);

    await connectSocket();
    router.replace("/(main)/home");
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
  ) => {
    const response = await register(email, password, name, avatar);
    if (!response?.token) throw new Error("No token returned from server");
    await updateToken(response.token);
    await connectSocket();
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    await disconnectSocket();
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
