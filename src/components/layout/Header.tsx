import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { ChevronDown, HelpCircle, LogOut, Menu, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function TopNav() {
  const email = useAuthStore((state) => state.user?.email);
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);
  const { logout, isLoggingOut } = useLogout();

  const displayName = email ?? "Admin";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 md:px-6 lg:justify-end">
      <button
        type="button"
        onClick={toggleMobileNav}
        aria-label="Open navigation"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#EEF0F1] data-[state=open]:bg-[#EEF0F1]"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-[#00D0F5] to-[#0892D0] text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[180px] truncate text-sm font-medium text-gray-900 md:block">
              {displayName}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <DropdownMenuLabel className="px-3 py-2">
            <p className="text-xs font-normal text-gray-500">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {displayName}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2">
            <Link to="/settings">
              <Settings className="h-4 w-4 text-gray-500" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2">
            <Link to="/help">
              <HelpCircle className="h-4 w-4 text-gray-500" />
              Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={logout}
            disabled={isLoggingOut}
            className="cursor-pointer px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
