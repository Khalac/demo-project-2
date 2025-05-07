import { useGetSession } from "@/hook";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { loading } = useGetSession();
  if (loading) return;
  const userId = localStorage.getItem("userId");
  return userId ? <Outlet /> : <Navigate to={"/login"} />;
};

export const AuthRoute = () => {
  const userId = localStorage.getItem("userId");
  return userId ? <Navigate to={"/"} /> : <Outlet />;
};
