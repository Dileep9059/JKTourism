import type { AuthType } from "@/context/AuthProvider";
import useAuth from "@/hooks/useAuth";

export const getToken = () => {
  const { auth } = useAuth() as { auth: AuthType }
  if (typeof window === "undefined") {
    return null;
  }
  if (auth?.accessToken) return auth?.accessToken;
  return null;
};

