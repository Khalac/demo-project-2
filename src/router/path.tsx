import { createBrowserRouter } from "react-router-dom";
import { DashboardPage, LoginPage, ResetPasswordPage } from "@/pages";
import { ProtectedRoute, AuthRoute } from "./auth-guard";
import Layout from "@/layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <AuthRoute />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);
