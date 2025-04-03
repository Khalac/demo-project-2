import { LoadingSpinner } from "@/components";
import useGetSession from "@/hook/useGetSession";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user, loading } = useGetSession();
  if (loading)
    return (
      <div className="w-ful h-[100vh] flex justify-center items-center">
        <LoadingSpinner className="" />
      </div>
    );
  return user.userId ? <Outlet /> : <Navigate to={"/login"} />;
};

export const AuthRoute = () => {
  const { user, loading } = useGetSession();
  if (loading)
    return (
      <div className="w-ful h-[100vh] flex justify-center items-center">
        <LoadingSpinner className="" />
      </div>
    );
  return user.userId ? <Navigate to={"/"} /> : <Outlet />;
};
