import { Outlet } from "react-router-dom";
import { Header } from "@/components";
import { useNotification } from "@/features/leave-request";

const Layout = () => {
  useNotification();
  return (
    <div className="bg-[#edf2f7] w-full flex flex-col h-[100dvh]">
      <Header />
      <main className="flex-1 overflow-y-scroll overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
