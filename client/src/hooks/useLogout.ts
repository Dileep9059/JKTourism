import { toast } from "sonner";
import axios from "../axios/axios";
import useAuth from "./useAuth";
import { d } from "../components/utils/crypto";
import type { AuthType } from "@/context/AuthProvider";

const useLogout = () => {
  const { setAuth } = useAuth() as { setAuth: (value: any) => void };
  const { auth } = useAuth() as { auth: AuthType };

  const logout = async () => {
    setAuth({});
    try {
    const token = auth?.accessToken;
      const response = await axios.get("/api/auth/signout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success(JSON.parse(await d(response?.data?.message)) || "Logged out successfully");
      // Clear local storage or any other state management
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;