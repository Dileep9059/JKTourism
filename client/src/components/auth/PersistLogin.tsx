import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import FullScreenLoader from "../loader/FullScreenLoader";
import type { AuthType } from "../../context/AuthProvider";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth() as { auth: AuthType, setAuth: (auth: AuthType) => void };
  const persist = true;
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        setAuth({} as AuthType);
        navigate("/", { replace: true });
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? (
      <FullScreenLoader />
    ) : <Outlet />}</>
  );
};

export default PersistLogin;