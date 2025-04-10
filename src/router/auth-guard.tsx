import { LoadingSpinner } from "@/components";
import useGetSession from "@/hook/use-get-session";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user, loading } = useGetSession();
  if (loading)
    return (
      <div className="w-ful h-[100vh] flex justify-center items-center">
        <LoadingSpinner className="" />
      </div>
    );
  return user.user_id ? <Outlet /> : <Navigate to={"/login"} />;
};

export const AuthRoute = () => {
  const location = useLocation();
  const { user, loading } = useGetSession();
  if (loading && location.pathname !== "/login")
    return (
      <div className="w-ful h-[100vh] flex justify-center items-center">
        <LoadingSpinner className="" />
      </div>
    );
  return user.user_id ? <Navigate to={"/"} /> : <Outlet />;
};
