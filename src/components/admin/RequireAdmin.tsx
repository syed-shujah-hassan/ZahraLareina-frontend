import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const location = useLocation();

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("adminToken");

  if (!hasToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};
