import { createBrowserRouter } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  ForgotPassword,
  ResetPasswordPage,
} from "@/pages";
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
            element: <HomePage />,
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
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);
