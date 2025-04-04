import { createBrowserRouter } from "react-router-dom";
import {
  AllRequestPage,
  LoginPage,
  ForgotPassword,
  ResetPasswordPage,
  CreateRequestPage,
} from "@/pages";
import { ProtectedRoute, AuthRoute } from "./auth-guard";
import Layout from "@/layout/layout";

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
            element: <AllRequestPage />,
          },
          {
            path: "create-request",
            element: <CreateRequestPage />,
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
