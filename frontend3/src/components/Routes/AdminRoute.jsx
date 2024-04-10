import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function AdminRoute() {
  const jwtToken = localStorage.getItem("jwtToken");
  const user = JSON.parse(localStorage.getItem("user"));

  return jwtToken && user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/un-authenticate" />
  );
}
