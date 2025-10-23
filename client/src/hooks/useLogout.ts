import { toast } from "sonner";
import { axiosPrivate } from "../axios/axios";
import useAuth from "./useAuth";
import { d } from "../components/utils/crypto";

const useLogout = () => {
  const { setAuth } = useAuth() as { setAuth: (value: any) => void };

  const logout = async () => {
    try {
      const response = await axiosPrivate.post("/api/auth/signout");
      setAuth({});

      toast.success(JSON.parse(await d(response?.data?.message)) || "Logged out successfully");
      // Clear local storage or any other state management
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;