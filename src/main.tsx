import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "@/router";
import { store } from "./redux-store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { UpdateLeaveRequestProvider } from "./features/leave-request/update-leave-request/model";
import { UserDetailProvider } from "./features/user/user-information/model";
import { CreateLeaveRequestProvider } from "./features/leave-request";
import { EmployeeDetailProvider } from "./features/employee/employee-detail/model";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CreateLeaveRequestProvider>
        <UpdateLeaveRequestProvider>
          <EmployeeDetailProvider>
            <UserDetailProvider>
              <RouterProvider router={router} />
              <Toaster />
            </UserDetailProvider>
          </EmployeeDetailProvider>
        </UpdateLeaveRequestProvider>
      </CreateLeaveRequestProvider>
    </Provider>
  </StrictMode>
);
