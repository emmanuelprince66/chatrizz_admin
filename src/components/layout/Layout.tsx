import { Outlet } from "react-router-dom";
import { TopNav } from "./Header";
import { Sidebar } from "./SideBar";

export const Layout = () => (
  <div className="flex h-screen bg-white">
    <Sidebar />

    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <TopNav />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);
