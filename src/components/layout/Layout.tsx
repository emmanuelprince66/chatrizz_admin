import { Outlet } from "react-router-dom";
import { TopNav } from "./Header";
import { Sidebar } from "./SideBar";

/**
 * App shell. It is pinned to the viewport (`fixed inset-0`) so the document itself
 * never scrolls; only <main> does. Mobile browsers otherwise let the page scroll past
 * the shell into blank space.
 */
export const Layout = () => (
  <div className="fixed inset-0 flex overflow-hidden bg-white">
    <Sidebar />

    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TopNav />

      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4 pb-8 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);
