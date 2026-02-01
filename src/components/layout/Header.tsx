"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, HelpCircle, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "../app/SearchContact";
import { Button } from "../ui/button";

export function TopNav() {
  const [userName] = useState("User"); // Placeholder; replace with actual user data
  const [userAvatar] = useState("/placeholder.svg"); // Placeholder; replace with actual avatar

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden p-2"
          aria-label="Toggle menu"
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
        </Button>

        <div className="flex items-center justify-end w-full ml-auto max-w-[70%] ">
          {/* Search Bar (Centered on Desktop, Hidden on Mobile, 40% Width) */}
          <div className="hidden md:flex flex-1 justify-center ml-auto">
            <SearchInput
              placeholder="Search..."
              value=""
              onValueChange={() => {}}
              className="w-full  mx-auto max-w-md"
            />
          </div>

          {/* Dropdown (Extreme Right on Desktop) */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-9 px-3 hover:bg-[#EEF0F1] data-[state=open]:bg-[#EEF0F1] rounded-md"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-gradient-to-br from-[#00D0F5] to-teal-600 text-white text-xs font-medium">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-gray-200 shadow-lg rounded-md p-1 mt-2"
                sideOffset={8}
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-[#EEF0F1] rounded-md"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700"
                  >
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-[#EEF0F1] rounded-md"
                >
                  <Link
                    to="/help"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700"
                  >
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                    <span>Help</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
