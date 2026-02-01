import lTwo from "@/assets/login_one.png";
import lOne from "@/assets/sidebar/l-1.png";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { links } from "@/lib/contant";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogOut = async () => {
    setIsPending(true);
    try {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      // Clear all localStorage items
      localStorage.removeItem("user_data");
      localStorage.removeItem("auth-storage");

      // Clear any other auth-related items you might have
      localStorage.removeItem("auth_token");

      toast.success("Login successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  type NavItemType = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };

  const NavItem = ({
    item,
    isBottom = false,
  }: {
    item: NavItemType;
    isBottom?: boolean;
  }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "rounded-md px-3 py-2 mb-2 transition-colors cursor-pointer",
            pathname === item.href
              ? "text-[#00D0F5] bg-[#EEF0F1]"
              : "text-muted-foreground hover:text-[#00D0F5] hover:bg-[#EEF0F1]/50",
          )}
        >
          <Link
            to={item.href}
            className="flex items-center text-sm font-medium"
            onClick={() => {
              if (isMobileOpen) setIsMobileOpen(false);
            }}
          >
            <div
              className={cn(
                "p-2 rounded-full bg-[#EEF0F1]",
                pathname === item.href && "text-[#00D0F5]",
                !isCollapsed && "mr-3",
              )}
            >
              <item.icon className="h-4 w-4" />
            </div>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        </div>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <>
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col border border-gray-100 bg-background transition-all duration-300 ease-in-out lg:static lg:z-0",
            isCollapsed ? "w-[72px]" : "w-72",
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="border-b border-gray-100 relative min-h-[64px]">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2",
                isCollapsed && "justify-center px-2",
              )}
            >
              {!isCollapsed && (
                <Link to="/" className="flex items-center font-semibold">
                  <img
                    src={lOne}
                    alt="Logo"
                    width={150}
                    height={40}
                    className="object-contain"
                  />
                </Link>
              )}
              {isCollapsed && (
                <Link
                  to="/"
                  className="flex items-center font-semibold w-full justify-center"
                >
                  <img
                    src={lTwo}
                    alt="Logo-2"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </Link>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "absolute hover:bg-[#00D0F5] hover:text-white top-11 right-0 h-8 w-8 z-10",
              isCollapsed && "top-11",
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <svg
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">
              {isCollapsed ? "Expand" : "Collapse"} Sidebar
            </span>
          </Button>
          <div className="flex-1 overflow-auto border border-gray-100 py-4">
            {links.map((section) => (
              <div key={section.title} className="px-2 py-4">
                {!isCollapsed && (
                  <h2 className="px-3 mb-3 text-xs font-semibold text-muted-foreground">
                    {section.title}
                  </h2>
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Logout Button at Bottom */}
          <div className="border-t border-gray-100 p-3 mt-auto">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogOut}
                  disabled={isPending}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors rounded-md",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full bg-[#EEF0F1]",
                      !isCollapsed && "mr-3",
                    )}
                  >
                    {isPending ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">
                      {isPending ? "Logging out..." : "Logout"}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Logout</TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </>
    </TooltipProvider>
  );
}
