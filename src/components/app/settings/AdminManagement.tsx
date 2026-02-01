"use client";

import { SearchInput } from "@/components/app/SearchInput";
import { Edit2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
// Removed shadcn table import - using regular HTML table
import { CustomModal } from "@/components/app/CustomModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateAdminForm } from "./CreateAdminForm";

// Dummy data
const adminData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Super Admin",
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Admin",
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Moderator",
    lastActive: "3 days ago",
    status: "inactive",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Admin",
    lastActive: "5 minutes ago",
    status: "active",
  },
];

const AdminManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1";
    if (status === "active") {
      return (
        <Badge
          className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-100`}
        >
          Active
        </Badge>
      );
    }
    return (
      <Badge
        className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-100`}
      >
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      "Super Admin": "bg-[#0892D0] text-white hover:bg-[#0892D0]",
      Admin: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Moderator: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    return (
      <Badge
        className={`text-xs font-medium px-2 py-1 ${
          colors[role] || "bg-gray-100 text-gray-800"
        }`}
      >
        {role}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900 mb-2">
            Admin Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage administrators and their permissions
          </p>
        </div>

        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <SearchInput
            placeholder="Search..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full mx-auto max-w-md"
          />

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#0892D0] hover:bg-[#0892D0]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Create Admin
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Name
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Email
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Role
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Last Active
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Status
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminData.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(admin.role)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {admin.lastActive}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(admin.status)}
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {adminData.map((admin) => (
              <div
                key={admin.id}
                className="p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {admin.name}
                    </h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {getRoleBadge(admin.role)}
                  {getStatusBadge(admin.status)}
                </div>
                <p className="text-sm text-gray-600">
                  Last active: {admin.lastActive}
                </p>
                s
              </div>
            ))}
          </div>
        </div>

        {/* Create Admin Modal */}
        <CustomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Administrator"
          description="Add a new administrator to your system"
        >
          <CreateAdminForm onClose={() => setIsCreateModalOpen(false)} />
        </CustomModal>
      </div>
    </div>
  );
};

export default AdminManagement;
