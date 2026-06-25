import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { authStore } from "../store/auth";

export function ProtectedRoute() {
  const location = useLocation();
  const token = useSyncExternalStore(authStore.subscribe, authStore.getToken);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
