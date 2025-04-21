import useGetSession from "@/hook/use-get-session";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  useGetSession();
  const userId = localStorage.getItem("userId");
  return userId ? <Outlet /> : <Navigate to={"/login"} />;
};

export const AuthRoute = () => {
  useGetSession();
  const userId = localStorage.getItem("userId");
  return userId ? <Navigate to={"/"} /> : <Outlet />;
};
