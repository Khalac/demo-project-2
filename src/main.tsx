import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "@/router";
import { store } from "./redux-store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import {
  CreateLeaveRequestProvider,
  UpdateLeaveRequestProvider,
} from "./context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CreateLeaveRequestProvider>
        <UpdateLeaveRequestProvider>
          <RouterProvider router={router} />
          <Toaster />
        </UpdateLeaveRequestProvider>
      </CreateLeaveRequestProvider>
    </Provider>
  </StrictMode>
);
