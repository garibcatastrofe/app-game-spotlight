import { Navigate, useLocation } from "react-router-dom";
import { api } from "../shared/services/api";

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { pathname } = useLocation();
  if (!api.isLoggedIn()) {
    return <Navigate to="/" replace state={{ from: pathname }} />;
  }
  return children;
}