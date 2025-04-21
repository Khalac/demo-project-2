import { Outlet } from "react-router-dom";
import { Header } from "@/components";

const Layout = () => {
  return (
    <div className="bg-[#edf2f7] h-[100vh] flex flex-col">
      <Header />
      <main className="px-5 pt-5 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
