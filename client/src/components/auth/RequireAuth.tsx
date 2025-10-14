import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import type { AuthType } from "../../context/AuthProvider";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { auth } = useAuth() as { auth: AuthType };
  const location = useLocation();

  const decoded = auth?.accessToken ? jwtDecode<{roles: string[]}>(auth.accessToken) : undefined;

  const roles = decoded?.roles || [];

  return roles.find((role: string) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;