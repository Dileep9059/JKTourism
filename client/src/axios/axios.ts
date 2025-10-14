import axios from "axios";
import { globalLoader } from "../components/utils/loaderBridge";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "text/plain" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    globalLoader.show(); // Show loader before request
    return config;
  },
  (error) => {
    globalLoader.hide(); // Hide loader on request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    globalLoader.hide(); // Hide loader on success
    return response;
  },
  (error) => {
    globalLoader.hide(); // Hide loader on failure
    return Promise.reject(error);
  }
);
export default axiosInstance;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "text/plain" },
});

axiosPrivate.interceptors.request.use(
  (config) => {
    globalLoader.show(); // Show loader before request
    return config;
  },
  (error) => {
    globalLoader.hide(); // Hide loader on request error
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => {
    globalLoader.hide(); // Hide loader on success
    return response;
  },
  (error) => {
    globalLoader.hide(); // Hide loader on failure
    return Promise.reject(error);
  }
);

let interceptorId: number | null = null;

export const setupAxiosPrivate = (accessToken: string) => {
  // clear old interceptor (if any)
  if (interceptorId !== null) {
    axiosPrivate.interceptors.request.eject(interceptorId);
  }

  interceptorId = axiosPrivate.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};