// pages/verification/index.tsx or components/Verification.tsx

"use client";
import { CustomCard } from "@/components/app/CustomCard";
import { SearchInput } from "@/components/app/SearchInput";
import VerificationDrawer from "@/components/app/verification/VerificationDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Building2,
  CheckCircle,
  ChevronDown,
  MoreHorizontal,
  User,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";

// Dummy data
const verificationData = [
  {
    id: 1,
    applicantName: "Tobi Olosunde",
    type: "Personal",
    plan: "Monthly",
    status: "Approved",
    date: "01/01/2024",
  },
  {
    id: 2,
    applicantName: "Tobi Olosunde",
    type: "Business",
    plan: "Monthly",
    status: "Pending",
    date: "01/01/2024",
  },
  {
    id: 3,
    applicantName: "Tobi Olosunde",
    type: "Organization",
    plan: "Monthly",
    status: "Rejected",
    date: "01/01/2024",
  },
  {
    id: 4,
    applicantName: "Tobi Olosunde",
    type: "Personal",
    plan: "Monthly",
    status: "Approved",
    date: "01/01/2024",
  },
  {
    id: 5,
    applicantName: "Tobi Olosunde",
    type: "Personal",
    plan: "Monthly",
    status: "Approved",
    date: "01/01/2024",
  },
];

const statsData = [
  {
    id: 1,
    title: "Verified Accounts",
    count: "3,434",
    icon: CheckCircle,
    bgColor: "bg-slate-800",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "Active",
    count: "3400",
    icon: Users,
    bgColor: "bg-slate-800",
    iconColor: "text-white",
  },
  {
    id: 3,
    title: "Inactive",
    count: "34",
    icon: UserX,
    bgColor: "bg-slate-800",
    iconColor: "text-white",
  },
];

const badgeStats = [
  {
    type: "Individual Badge",
    count: "1.4k",
    color: "bg-blue-100 text-blue-700",
    icon: User,
  },
  {
    type: "Business Badge",
    count: "1k",
    color: "bg-green-100 text-green-700",
    icon: Building,
  },
  {
    type: "Organization Badge",
    count: "1k",
    color: "bg-yellow-100 text-yellow-700",
    icon: Building2,
  },
];

const Verification = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [timeFilter] = useState("This Month");
  const [openVerificationDrawer, setOpenVerificationDrawer] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Approved: "bg-green-100 text-green-700 hover:bg-green-100",
      Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      Rejected: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
      <Badge
        className={`text-xs font-medium px-2 py-1 ${
          statusStyles[status as keyof typeof statusStyles] ||
          "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const iconMap = {
      Personal: User,
      Business: Building,
      Organization: Building2,
    };
    const IconComponent = iconMap[type as keyof typeof iconMap] || User;
    return <IconComponent className="w-4 h-4 text-gray-600" />;
  };

  const filterButtons = ["All", "Approved", "Pending", "Rejected"];

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900">
            Verification
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput
              placeholder="Search"
              value={searchValue}
              onValueChange={setSearchValue}
              className="w-full sm:w-80"
            />

            <Select defaultValue={timeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
                <ChevronDown className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <CustomCard
                key={stat.id}
                className={`${stat.bgColor} rounded-lg p-6 text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.count}</div>
                <div className="text-sm opacity-90">{stat.title}</div>
              </CustomCard>
            );
          })}
          <CustomCard>
            <div className="grid grid-cols-1 gap-4">
              {badgeStats.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center w-full justify-between flex gap-3"
                  >
                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-gray-600">{badge.type}</div>
                    </div>

                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {badge.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CustomCard>
        </div>

        {/* Badge Statistics */}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={`${
                activeFilter === filter
                  ? "bg-[#0892D0] hover:bg-[#0892D0]/90 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Applicant Name
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Type
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Plan
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Status
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Date
                  </th>
                  <th className="text-left font-semibold text-gray-900 px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {verificationData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.applicantName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className="text-gray-700">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.plan}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-gray-600">{item.date}</td>
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
                          <DropdownMenuItem
                            onClick={() => setOpenVerificationDrawer(true)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Reject
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
          <div className="lg:hidden">
            {verificationData.map((item) => (
              <div
                key={item.id}
                className="p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.applicantName}
                      </h3>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setOpenVerificationDrawer(true)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Type
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-700">{item.type}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Plan
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{item.plan}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Status
                    </p>
                    <div className="mt-1">{getStatusBadge(item.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VerificationDrawer
        open={openVerificationDrawer}
        onOpenChange={setOpenVerificationDrawer}
      />
    </div>
  );
};

export default Verification;
