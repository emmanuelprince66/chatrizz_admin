import { useFetchMyProfileQuery } from "@/api/auth/fetch-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getInitials } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { ChevronDown, HelpCircle, LogOut, Menu, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function TopNav() {
  const email = useAuthStore((state) => state.user?.email);
  const { data: profile } = useFetchMyProfileQuery();
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);
  const { logout, isLoggingOut } = useLogout();

  // The login response has no name, so it comes from the profile; fall back to the email.
  const displayName = profile?.full_name?.trim() || profile?.username || email || "Admin";
  const initials = getInitials(displayName);

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
            aria-label={`Account menu for ${displayName}`}
            className="group flex cursor-pointer items-center gap-3 rounded-full p-1 transition-colors hover:bg-[#EEF0F1] data-[state=open]:bg-[#EEF0F1] md:py-1.5 md:pr-3 md:pl-1.5"
          >
            <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
              {profile?.profile_picture && (
                <AvatarImage src={profile.profile_picture} alt="" className="object-cover" />
              )}
              <AvatarFallback className="bg-gradient-to-br from-[#00D0F5] to-[#0892D0] text-xs font-semibold tracking-wide text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block max-w-[180px] truncate text-sm font-semibold text-gray-900">
                {displayName}
              </span>
              {email && email !== displayName && (
                <span className="block max-w-[180px] truncate text-xs text-gray-500">
                  {email}
                </span>
              )}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180 md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00D0F5] to-[#0892D0] text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-900">
                {displayName}
              </span>
              {email && (
                <span className="block truncate text-xs font-normal text-gray-500">
                  {email}
                </span>
              )}
            </span>
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
