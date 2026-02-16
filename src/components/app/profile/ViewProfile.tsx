// src/components/app/profile/ViewProfile.tsx

import { useFetchUserByIdQuery } from "@/api/profile/fetch-user-by-id";
import {
  type ContentFilter,
  useFetchUserContentQuery,
} from "@/api/profile/fetch-user-content";
import { useRemoveBadgeMutation } from "@/api/profile/remove-badge";
import { useSuspendUserMutation } from "@/api/profile/suspend-users";
import { CustomModal } from "@/components/app/CustomModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Info, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContentList from "./ContentList";

interface ViewProfileProps {
  userId: string;
}

const ViewProfile = ({ userId }: ViewProfileProps) => {
  const [activeTab, setActiveTab] = useState<ContentFilter>("POST");
  const [page, setPage] = useState(1);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Fetch user details
  const {
    data: userDetail,
    isLoading: userLoading,
    isError: userError,
  } = useFetchUserByIdQuery({
    userId,
    enabled: !!userId,
  });

  // Fetch user content based on active tab
  const {
    data: contentData,
    isLoading: contentLoading,
    // isError: contentError,
  } = useFetchUserContentQuery({
    params: {
      userId,
      filter: activeTab,
      page,
      limit: 10,
    },
    enabled: !!userId,
  });

  console.log(activeTab);

  console.log("contentData", contentData);

  // Mutations
  const removeBadgeMutation = useRemoveBadgeMutation();
  const suspendUserMutation = useSuspendUserMutation();

  const isSuspended = userDetail?.is_active === false;
  const isSuspending = suspendUserMutation.isPending;

  const handleRemoveBadge = async () => {
    try {
      await removeBadgeMutation.mutateAsync({ id: userId });
      toast.success("Badge removed successfully");
    } catch (error) {
      toast.error("Failed to remove badge", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleSuspend = async () => {
    try {
      await suspendUserMutation.mutateAsync({ id: userId });
      toast.success("User suspended successfully");
      setShowSuspendModal(false);
    } catch (error) {
      toast.error("Failed to suspend user", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleTabChange = (tab: ContentFilter) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  // Promotions dummy data
  const promotions = [
    {
      id: 1,
      name: "Macbook pro 2025",
      price: "₦3,500,000",
      status: "Active",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      name: "Macbook pro 2025",
      price: "₦3,500,000",
      status: "Active",
      statusColor: "bg-green-500",
    },
    {
      id: 3,
      name: "Macbook pro 2025",
      price: "₦3,500,000",
      status: "Expired",
      statusColor: "bg-red-500",
    },
  ];

  // Skeleton Loader Components
  const ProfileSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="h-20 bg-gray-200 rounded" />
    </div>
  );

  const StatsSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 bg-gray-100 rounded">
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  );

  // Error state
  if (userError) {
    return (
      <div className="w-full mx-auto bg-white p-6">
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">Failed to load user profile</p>
          <p className="text-gray-500 text-xs mt-2">
            Please try again or contact support
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white">
      <div className="w-full">
        {/* ROW 1: Profile Info + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Column 1: Profile Information */}
          <div className="md:col-span-1">
            {userLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="flex flex-col">
                <div className="flex gap-2 md:gap-3 mb-3 md:mb-4">
                  <img
                    src={
                      userDetail?.profile_picture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetail?.username}`
                    }
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                      <h2 className="text-base md:text-lg font-bold">
                        {userDetail?.full_name || "No name"}
                      </h2>
                      {userDetail?.type === "BUSINESS" && (
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 text-xs">
                      @{userDetail?.username || "No username"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5 text-xs text-gray-700 mb-2 md:mb-3">
                  {userDetail?.business_location && (
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">
                        {userDetail.business_location}
                      </span>
                    </div>
                  )}
                  {userDetail?.phone && (
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{userDetail.phone}</span>
                    </div>
                  )}
                  {userDetail?.email && (
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {userDetail.email}
                      </span>
                    </div>
                  )}
                </div>

                {userDetail?.business_category && (
                  <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                    <span className="font-semibold text-xs text-gray-900">
                      {userDetail.business_category}
                    </span>
                  </div>
                )}

                {userDetail?.business_description && (
                  <p className="text-xs text-gray-600 leading-tight">
                    {userDetail.business_description}
                  </p>
                )}

                {userDetail?.bio && !userDetail?.business_description && (
                  <p className="text-xs text-gray-600 leading-tight">
                    {userDetail.bio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Column 2-3: Stats Grid + Buttons */}
          <div className="md:col-span-2">
            {userLoading ? (
              <StatsSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 mb-2 md:mb-3">
                  <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {userDetail?.post_count || 0}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600">
                      Posts
                    </div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {userDetail?.followers_count || 0}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600">
                      Followers
                    </div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {userDetail?.following_count || 0}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600">
                      Following
                    </div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {userDetail?.messages_count || 0}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600">
                      Messages Sent
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <Button
                    variant="outline"
                    className="bg-transparent text-[11px] md:text-xs h-7 md:h-8 flex-1"
                    onClick={handleRemoveBadge}
                    disabled={removeBadgeMutation.isPending}
                  >
                    {removeBadgeMutation.isPending ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        <span className="hidden sm:inline">Removing...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      "✓ Remove Badge"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-[11px] md:text-xs h-7 md:h-8 flex-1"
                    onClick={() => setShowSuspendModal(true)}
                    disabled={isSuspended}
                  >
                    {isSuspended ? (
                      <span className="hidden sm:inline">User Suspended</span>
                    ) : (
                      "⏸ Suspend"
                    )}
                    <span className="sm:hidden">
                      {isSuspended ? "Suspended" : "⏸"}
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3 md:my-4"></div>

        {/* ROW 2: Promotions */}
        <div className="mb-4 md:mb-6 grid grid-cols-1 md:grid-cols-1 overflow-hidden w-md:w-full">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h3 className="text-sm md:text-base font-bold">Promotions</h3>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-[11px] md:text-xs font-medium"
            >
              See More
            </a>
          </div>

          <div className="overflow-x-auto pb-2 snap-x snap-mandatory  px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 md:gap-3">
              {promotions.map((promo) => (
                <div key={promo.id} className="flex-shrink-0  snap-start">
                  <Card className="p-3 md:p-4 bg-gray-50">
                    <div className="flex gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                        <div className="text-white text-lg md:text-xl">📱</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs md:text-sm text-gray-900 truncate">
                          {promo.name}
                        </h4>
                        <p className="text-blue-600 font-bold text-xs md:text-sm">
                          {promo.price}
                        </p>
                      </div>
                      <Badge
                        className={`${promo.statusColor} text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 h-fit flex-shrink-0`}
                      >
                        {promo.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 text-[10px] md:text-xs mb-1">
                          Duration:
                        </p>
                        <p className="text-gray-900 font-medium text-[11px] md:text-xs">
                          7 days (Jul 29 – Aug 5)
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px] md:text-xs mb-1">
                          Estimated Reach:
                        </p>
                        <p className="text-gray-900 font-medium text-[11px] md:text-xs">
                          1,200 people
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3 md:my-4"></div>

        {/* ROW 3: Tabs Section with ContentList */}
        <div className="w-full">
          <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto">
            <button
              onClick={() => handleTabChange("POST")}
              className={`px-3 md:px-4 py-1 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTab === "POST"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => handleTabChange("PRODUCT")}
              className={`px-3 md:px-4 py-1 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTab === "PRODUCT"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleTabChange("REVIEW")}
              className={`px-3 md:px-4 py-1 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTab === "REVIEW"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Content List */}
          <ContentList
            response={contentData}
            loading={contentLoading}
            setPage={setPage}
            page={page}
            contentType={
              activeTab === "POST"
                ? "Posts"
                : activeTab === "PRODUCT"
                  ? "Products"
                  : "Reviews"
            }
          />
        </div>
      </div>

      {/* Suspend User Modal */}
      <CustomModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        trigger={false}
        title="Confirm Suspend User"
      >
        <div className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
            Are you sure you want to suspend{" "}
            <span className="font-semibold text-gray-900">
              {userDetail?.username || userDetail?.email}
            </span>
            ?
          </p>

          <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] md:text-xs text-blue-700 mt-1">
                  This user will be suspended from using the platform. Are you
                  sure?
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 md:gap-3">
            <button
              onClick={() => setShowSuspendModal(false)}
              disabled={isSuspending}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSuspend}
              disabled={isSuspending}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              {isSuspending ? (
                <>
                  <Spinner size={"sm"} color="text-white" />
                  Suspending...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Suspend user
                </>
              )}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ViewProfile;
