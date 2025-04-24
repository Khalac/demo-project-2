import { createBrowserRouter } from "react-router-dom";
import {
  DashboardPage,
  LoginPage,
  NotificationPage,
  ResetPasswordPage,
} from "@/pages";
import { ProtectedRoute, AuthRoute } from "./auth-guard";
import Layout from "@/layout/Layout";
import ListEmployeePage from "@/pages/list-employee-page";

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
