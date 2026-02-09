"use client";

import React from "react";

import { CustomCard } from "@/components/app/CustomCard";
import { DatePickerWithRange } from "@/components/app/DateRangePicker";
import EngagementChart from "@/components/overview/EngagementChart";
import RecentReportsTable from "@/components/overview/RecentsReportsTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewHook } from "@/hooks/useOverviewHook";
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

// Register the required Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
}

interface LocationData {
  name: string;
  activeUsers: number;
  postsThisWeek: number;
  marketplaceInteractions: number;
  percentage: number;
}

const OverviewSkeleton = () => (
  <div className="min-h-screen">
    <div className="container mx-auto">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full p-6 bg-slate-900 border-slate-800">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <Skeleton className="h-8 w-8 rounded-full " />
              <Skeleton className="h-4 w-24 " />
              <Skeleton className="h-8 w-20 " />
              <Skeleton className="h-3 w-32 " />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart and Location Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-white border-gray-200">
          <Skeleton className="h-6 w-40 mb-6 " />
          <Skeleton className="h-64 w-full " />
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-6 w-32 mb-4 " />
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="w-full p-4 bg-white border-gray-200">
              <Skeleton className="h-5 w-24 mb-2 " />
              <Skeleton className="h-4 w-full mb-3 " />
              <div className="flex items-center justify-between">
                <Skeleton className="h-2 w-full mr-3" />
                <Skeleton className="h-4 w-12 " />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reports Table Skeleton */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32 " />
          <Skeleton className="h-4 w-16 " />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 flex-1 " />
                  <Skeleton className="h-10 flex-1 " />
                  <Skeleton className="h-10 flex-1 " />
                  <Skeleton className="h-10 w-24 " />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => (
  <CustomCard className="w-full p-6 bg-slate-900 border-0 flex flex-col justify-between rounded-2xl h-32">
    <div className="flex flex-row items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    </div>
    <div className="flex flex-col items-end">
      <p className="text-3xl font-bold text-white">{value}</p>
      {trend && <p className="text-xs text-emerald-400 mt-0.5">{trend}</p>}
    </div>
  </CustomCard>
);

const LocationCard = ({ data }: { data: LocationData }) => (
  <CustomCard className="w-full p-4 bg-white border-gray-200 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-base font-semibold text-gray-900">{data.name}</h4>
      {data.percentage === 20 && (
        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700">
          M
        </div>
      )}
    </div>
    <p className="text-sm text-gray-600 mb-3">
      {data.activeUsers.toLocaleString()} Active Users |{" "}
      {data.postsThisWeek.toLocaleString()} Posts this week |{" "}
      {data.marketplaceInteractions.toLocaleString()} Marketplace Interactions
    </p>
    <div className="flex items-center justify-between">
      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${data.percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-semibold text-blue-600 min-w-fit">
        {data.percentage}%
      </span>
    </div>
  </CustomCard>
);

const Overview = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [searchInput] = useState("");
  const [page, setPage] = useState(1);

  const { OverviewData, OverviewDataLoading } = useOverviewHook({
    dateRange,
    searchInput,
    page,
  });

  console.log("OverviewData", OverviewData);
  console.log("OverviewDataLoading", OverviewDataLoading);

  // Extract real data from API
  const apiData = OverviewData;

  console.log("apiData", apiData);

  const statsData = [
    {
      title: "Total Users",
      value: apiData?.total_users?.toLocaleString() || "0",
      icon: "👤",
    },
    {
      title: "Active Users",
      value: apiData?.active_users?.toLocaleString() || "0",
      icon: "🔥",
    },
    {
      title: "Total Posts",
      value: apiData?.total_posts?.toLocaleString() || "0",
      icon: "📝",
    },
    {
      title: "Engagement Rate",
      value: `${apiData?.engagement_rate || 0}%`,
      trend: apiData?.change_engagement_rate
        ? `${apiData.change_engagement_rate > 0 ? "↑" : "↓"} ${Math.abs(
            apiData.change_engagement_rate,
          )}% from last month`
        : undefined,
      icon: "📈",
    },
  ];

  const locationData: LocationData[] = [
    {
      name: "Lagos",
      activeUsers: 12430,
      postsThisWeek: 2100,
      marketplaceInteractions: 850,
      percentage: 45,
    },
    {
      name: "Abuja",
      activeUsers: 8520,
      postsThisWeek: 1650,
      marketplaceInteractions: 650,
      percentage: 30,
    },
    {
      name: "Rivers",
      activeUsers: 4200,
      postsThisWeek: 980,
      marketplaceInteractions: 420,
      percentage: 15,
    },
    {
      name: "Kaduna",
      activeUsers: 2800,
      postsThisWeek: 650,
      marketplaceInteractions: 280,
      percentage: 10,
    },
  ];

  // Check if engagement data exists

  // const hasEngagementData = apiData?.trend;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900">
            Overview
          </h1>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>

        {OverviewDataLoading ? (
          <OverviewSkeleton />
        ) : (
          <>
            {/* Stats Cards - Deep Blue Theme with Real Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Chart and Location Cards - Light Theme */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <CustomCard className="p-6 bg-white border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  Engagement Trend
                </h3>
                <div className="h-64">
                  <EngagementChart trendData={apiData?.trend} />
                </div>
              </CustomCard>

              <CustomCard className="p-6 bg-white border-gray-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Top Locations
                  </h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    See All
                  </button>
                </div>
                <div className="space-y-4">
                  {locationData.map((loc, index) => (
                    <LocationCard key={index} data={loc} />
                  ))}
                </div>
              </CustomCard>
            </div>

            {/* Reports Table with Real Data */}
            <RecentReportsTable
              response={apiData || []}
              loading={OverviewDataLoading}
              setPage={setPage}
              page={page}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
