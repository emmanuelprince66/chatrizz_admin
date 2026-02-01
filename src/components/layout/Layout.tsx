import { Outlet } from "react-router-dom";
import { TopNav } from "./Header";
import { Sidebar } from "./SideBar";

export const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <TopNav />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background h-full p-3 md:p-8 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
