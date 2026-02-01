// components/CreateAdminForm.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface CreateAdminFormProps {
  onClose: () => void;
}

const permissionsData = {
  "User Management": [
    { id: "create_users", label: "Create Users" },
    { id: "edit_users", label: "Edit Users" },
    { id: "delete_users", label: "Delete Users" },
    { id: "view_users", label: "View Users" },
  ],
  "Content Management": [
    { id: "create_content", label: "Create Content" },
    { id: "edit_content", label: "Edit Content" },
    { id: "delete_content", label: "Delete Content" },
    { id: "publish_content", label: "Publish Content" },
  ],
  "System Settings": [
    { id: "system_config", label: "System Configuration" },
    { id: "backup_restore", label: "Backup & Restore" },
    { id: "security_settings", label: "Security Settings" },
    { id: "api_access", label: "API Access" },
  ],
  "Reports & Analytics": [
    { id: "view_reports", label: "View Reports" },
    { id: "export_data", label: "Export Data" },
    { id: "analytics_access", label: "Analytics Access" },
  ],
};

export const CreateAdminForm = ({ onClose }: CreateAdminFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        return [...prev, permissionId];
      }
      return prev.filter((id) => id !== permissionId);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data:", formData);
    console.log("Selected Permissions:", selectedPermissions);

    // You can add your API call here
    // Example: await createAdmin({ ...formData, permissions: selectedPermissions });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className="w-full"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="w-full"
          required
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Select onValueChange={(value) => handleInputChange("role", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Permissions */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Permissions</Label>
        <div className="border border-gray-200 rounded-lg">
          <Accordion type="multiple" className="w-full">
            {Object.entries(permissionsData).map(([category, permissions]) => (
              <AccordionItem
                key={category}
                value={category}
                className="border-b-0"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-800">
                    {category}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              permission.id,
                              checked as boolean,
                            )
                          }
                          className="data-[state=checked]:bg-[#0892D0] data-[state=checked]:border-[#0892D0]"
                        />
                        <Label
                          htmlFor={permission.id}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-[#0892D0] hover:bg-[#0892D0]/90 text-white order-1 sm:order-2"
        >
          Create Admin
        </Button>
      </div>
    </form>
  );
};
