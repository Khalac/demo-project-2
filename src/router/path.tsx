import { createBrowserRouter } from "react-router-dom";
import {
  DashboardPage,
  LoginPage,
  NotificationPage,
  ResetPasswordPage,
  ListEmployeePage,
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
            element: <DashboardPage />,
          },
          {
            path: "notification",
            element: <NotificationPage />,
          },
          {
            path: "employees",
            element: <ListEmployeePage />,
          },
        ],
      },
    ],
  },
  {
    path: "",
    element: <AuthRoute />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);
