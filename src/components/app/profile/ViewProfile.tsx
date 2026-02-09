import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";

const ViewProfile = () => {
  const [activeTab, setActiveTab] = useState("post");

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

  return (
    <div className="w-full  mx-auto bg-white">
      <div className="w-full">
        {/* ROW 1: Profile Info + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Column 1: Profile Information */}
          <div className="md:col-span-1">
            <div className="flex flex-col">
              <div className="flex gap-3 mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tobi"
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold">Tobi Olosunde</h2>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-gray-600 text-xs">@tobi_o</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>Lagos Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>+234 8123456789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span>tobilosunde@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-xs text-gray-900">
                  Laundry Services
                </span>
                <Badge variant="outline" className="bg-yellow-50 text-xs py-0">
                  ⭐ 3.5
                </Badge>
              </div>
              <p className="text-xs text-gray-600 leading-tight">
                Lorem ipsum dolor sit amet consectetur. Viverra eget eget sit
                egestas orci massa.
              </p>
            </div>
          </div>

          {/* Column 2-3: Stats Grid + Buttons */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xl font-bold text-gray-900">100</div>
                <div className="text-xs text-gray-600">Posts</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xl font-bold text-gray-900">100</div>
                <div className="text-xs text-gray-600">Followers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xl font-bold text-gray-900">100</div>
                <div className="text-xs text-gray-600">Following</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xl font-bold text-gray-900">100</div>
                <div className="text-xs text-gray-600">Messages Sent</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-transparent text-xs h-8 flex-1"
              >
                ✓ Remove Badge
              </Button>
              <Button
                variant="outline"
                className="bg-transparent text-xs h-8 flex-1"
              >
                ⏸ Suspend
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* ROW 2: Promotions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold">Promotions</h3>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
            >
              See More
            </a>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {promotions.map((promo) => (
              <div key={promo.id} className="flex-shrink-0 w-80 snap-start">
                <Card className="p-4 bg-gray-50">
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                      <div className="text-white text-xl">📱</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {promo.name}
                      </h4>
                      <p className="text-blue-600 font-bold text-sm">
                        {promo.price}
                      </p>
                    </div>
                    <Badge
                      className={`${promo.statusColor} text-white text-xs py-1 px-2 h-fit flex-shrink-0`}
                    >
                      {promo.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Duration:</p>
                      <p className="text-gray-900 font-medium">
                        7 days (Jul 29 – Aug 5)
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">
                        Estimated Reach:
                      </p>
                      <p className="text-gray-900 font-medium">1,200 people</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* ROW 3: Tabs Section */}
        <div className="w-full">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("post")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === "post" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Post
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === "catalog" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === "reviews" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "post" && (
            <div className="space-y-3">
              {/* Post 1 */}
              <Card className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tobi"
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">
                          Tobi Olosunde
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      </div>
                      <p className="text-xs text-gray-500">@tobi_o</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-700 mb-2 leading-tight">
                  Lorem ipsum dolor sit amet consectetur. Viverra eget eget sit
                  egestas orci massa. Neque pellentesque quam sagittis lacus
                  vitae.
                </p>
                <a
                  href="#"
                  className="text-blue-600 text-xs font-medium hover:underline"
                >
                  Read more
                </a>
                <div className="flex gap-3 mt-2 pt-2 border-t border-gray-200 text-gray-600 text-xs">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ThumbsUp className="w-3 h-3" />
                    <span>2.6k</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageSquare className="w-3 h-3" />
                    <span>2.6k</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageCircle className="w-3 h-3" />
                    <span>2.6k</span>
                  </button>
                  <button className="ml-auto">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              </Card>

              {/* Post 2 */}
              <Card className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tobi2"
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">
                          Tobi Olosunde
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      </div>
                      <p className="text-xs text-gray-500">@tobi_o • 3d</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-tight">
                  Lorem ipsum dolor sit amet consectetur. Viverra eget eget sit
                  egestas orci massa.
                </p>
              </Card>
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No catalog items yet</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
