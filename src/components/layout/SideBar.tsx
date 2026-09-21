import logoMark from "@/assets/login_one.png";
import logoFull from "@/assets/sidebar/l-1.png";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogout } from "@/hooks/useLogout";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { links, type NavLinkItem } from "@/lib/contant";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { ChevronLeft, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

/** Shows a tooltip with the label only when the sidebar is collapsed. */
const CollapsedTooltip = ({
  label,
  isCollapsed,
  children,
}: {
  label: string;
  isCollapsed: boolean;
  children: ReactNode;
}) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
  </Tooltip>
);

const NavItem = ({
  item,
  isCollapsed,
  onNavigate,
}: {
  item: NavLinkItem;
  isCollapsed: boolean;
  onNavigate: () => void;
}) => (
  <CollapsedTooltip label={item.name} isCollapsed={isCollapsed}>
    <NavLink
      to={item.href}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isCollapsed && "justify-center px-2",
          isActive
            ? "bg-[#E6F4FA] text-[#0892D0]"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-white text-[#0892D0] shadow-sm"
                : "bg-[#EEF0F1] group-hover:bg-white",
            )}
          >
            <item.icon className="h-4 w-4" />
          </span>
          {!isCollapsed && <span className="truncate">{item.name}</span>}
        </>
      )}
    </NavLink>
  </CollapsedTooltip>
);

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen);
  const closeMobileNav = useUIStore((state) => state.closeMobileNav);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { logout, isLoggingOut } = useLogout();

  // Reset the mobile drawer when the viewport grows, so its state never leaks into the desktop layout.
  useEffect(() => {
    if (isDesktop) closeMobileNav();
  }, [isDesktop, closeMobileNav]);

  return (
    <TooltipProvider>
      {isMobileNavOpen && (
        <div
          aria-hidden="true"
          onClick={closeMobileNav}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out lg:relative lg:z-40 lg:translate-x-0 lg:shadow-none",
          isCollapsed ? "w-[76px]" : "w-72",
          isMobileNavOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-16 shrink-0 items-center border-b border-gray-100 px-4">
          <Link
            to="/"
            onClick={closeMobileNav}
            className={cn("flex items-center", isCollapsed && "w-full justify-center")}
          >
            {isCollapsed ? (
              <img src={logoMark} alt="Chatrizz" width={36} height={32} className="object-contain" />
            ) : (
              <img src={logoFull} alt="Chatrizz" width={140} height={36} className="object-contain" />
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "absolute -right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-primary hover:text-white",
              // When the mobile drawer is closed the button would poke out past the screen edge.
              isMobileNavOpen ? "flex" : "hidden lg:flex",
            )}
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {links.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    onNavigate={closeMobileNav}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <CollapsedTooltip label="Logout" isCollapsed={isCollapsed}>
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60",
                isCollapsed && "justify-center px-2",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF0F1]">
                {isLoggingOut ? <Spinner size="sm" /> : <LogOut className="h-4 w-4" />}
              </span>
              {!isCollapsed && (isLoggingOut ? "Logging out..." : "Logout")}
            </button>
          </CollapsedTooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
