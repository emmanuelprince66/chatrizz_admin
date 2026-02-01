import { SearchInput } from "@/components/app/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

// Dummy data (unchanged)
const dummyUsers = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    accountType: "Premium",
    location: "New York, USA",
    followers: 1250,
    status: "Active",
  },
  // ... (rest of the dummyUsers array remains unchanged)
];

// const accountTypes = ["All Types", "Basic", "Premium", "Enterprise"];
// const statuses = ["All Status", "Active", "Inactive", "Suspended"];

const Content = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAccountType] = useState("All Types");
  const [selectedStatus] = useState("All Status");
  const [users] = useState(dummyUsers);
  const [activeFilter, setActiveFilter] = useState("Posts");
  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.location.toLowerCase().includes(searchValue.toLowerCase());

    const matchesAccountType =
      selectedAccountType === "All Types" ||
      user.accountType === selectedAccountType;
    const matchesStatus =
      selectedStatus === "All Status" || user.status === selectedStatus;

    return matchesSearch && matchesAccountType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getAccountTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Enterprise":
        return "default";
      case "Premium":
        return "secondary";
      case "Basic":
        return "outline";
      default:
        return "outline";
    }
  };

  // const clearFilters = () => {
  //   setSelectedAccountType("All Types");
  //   setSelectedStatus("All Status");
  //   setSearchValue("");
  // };

  // const hasActiveFilters =
  //   selectedAccountType !== "All Types" ||
  //   selectedStatus !== "All Status" ||
  //   searchValue !== "";

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header with Search */}
      <div className="flex flex-col w-full items-start sm:items-center gap-4 sm:flex-row sm:justify-between ">
        <div className="flex flex-col items-start">
          <p className="text-xl sm:text-2xl md:text-3xl font-cabinet font-[500] tracking-tight">
            Content Moderation
          </p>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-md">
            Manage and monitor all user accounts in your system.
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <SearchInput
            placeholder="Search users..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full sm:w-64 md:w-80 max-w-md"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Account Type Filter */}
          <div className="flex space-x-2 gap-3">
            <Button
              onClick={() => setActiveFilter("Posts")}
              style={{
                width: "130px",
                backgroundColor:
                  activeFilter === "Posts" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Posts" ? "white" : "black",
              }}
            >
              Posts
            </Button>
            <Button
              onClick={() => setActiveFilter("catalog_items")}
              style={{
                width: "130px",
                backgroundColor:
                  activeFilter === "catalog_items" ? "#0892D0" : " #EEF0F1",
                color: activeFilter === "catalog_items" ? "white" : "black",
              }}
            >
              Catalog Items
            </Button>
            <Button
              onClick={() => setActiveFilter("reviews")}
              style={{
                width: "130px",
                backgroundColor:
                  activeFilter === "reviews" ? "#0892D0" : " #EEF0F1",
                color: activeFilter === "reviews" ? "white" : "black",
              }}
            >
              Reviews
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Mobile View: Card Layout */}
      <div className="block md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users found matching your criteria.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.id}</span>
                    <Badge
                      variant={getAccountTypeBadgeVariant(user.accountType)}
                      className="text-xs"
                    >
                      {user.accountType}
                    </Badge>
                    <Badge
                      variant={getStatusBadgeVariant(user.status)}
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="text-sm">{user.location}</div>
                  <div className="text-sm">
                    Followers: {user.followers.toLocaleString()}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Suspend User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table Layout */}
      <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                  Content ID
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                  User
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden lg:table-cell">
                  Content
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                  Engagements
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden lg:table-cell">
                  Posted On
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden xl:table-cell">
                  Status
                </th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                  Action
                </th>

                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b hover:bg-muted/50 ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/25"
                  }`}
                >
                  <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">
                    {user.id}
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground lg:hidden text-xs truncate max-w-[120px]">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground text-xs sm:text-sm hidden lg:table-cell truncate max-w-[200px]">
                    {user.email}
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">
                    <Badge
                      variant={getAccountTypeBadgeVariant(user.accountType)}
                      className="text-xs"
                    >
                      {user.accountType}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm hidden lg:table-cell">
                    {user.location}
                  </td>
                  <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm hidden xl:table-cell">
                    {user.followers.toLocaleString()}
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">
                    <Badge
                      variant={getStatusBadgeVariant(user.status)}
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="p-3 sm:p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No users found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
