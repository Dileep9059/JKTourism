
import axiosInstance from "../axios/axios";
import { setupAxiosPrivate } from "../axios/axios";
import { d } from "../components/utils/crypto";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth() as { setAuth: (value: any) => void };

  const refresh = async () => {
    const res = await axiosInstance.get("/api/auth/refresh-token", {
      withCredentials: true,
    });

    const response = JSON.parse(await d(res.data));

    setAuth((prev: any) => {
      return {
        ...prev,
        roles: response.roles,
        accessToken: response.accessToken,

        user: response?.username,
        email: response?.email,
        maskedEmail: response?.maskedEmail,
        name: response?.name,
        mobile: response?.mobile,
        profileImage: response?.profileImage,
      };
    });
    setupAxiosPrivate(response.accessToken);
    return response.accessToken;
  };
  return refresh;
};

export default useRefreshToken;