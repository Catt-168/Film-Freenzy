import { Navigate, Outlet } from "react-router-dom";
import UserNavigation from "../Navigation/UserNavigation";

export default function ProtectedRoute() {
  const jwtToken = JSON.parse(localStorage.getItem("jwtToken"));

  if (!jwtToken) <Navigate to="/login" />;
  return <Outlet />;
}
