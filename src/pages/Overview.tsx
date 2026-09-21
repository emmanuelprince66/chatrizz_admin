import { CustomCard } from "@/components/app/CustomCard";
import { DatePickerWithRange } from "@/components/app/DateRangePicker";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard, type StatCardProps } from "@/components/app/StatCard";
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
import { FileText, TrendingUp, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

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

const STAT_CARD_COUNT = 4;

const ChartAndTableSkeleton = () => (
  <>
    <Card className="rounded-2xl border-gray-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-6 h-6 w-40" />
      <Skeleton className="h-64 w-full" />
    </Card>

    <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  </>
);

const formatCount = (value?: number) => (value ?? 0).toLocaleString();

const Overview = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [page, setPage] = useState(1);

  const { OverviewData, OverviewDataLoading } = useOverviewHook({
    dateRange,
    searchInput: "",
    page,
  });

  const engagementChange = OverviewData?.change_engagement_rate;
  const statsData: StatCardProps[] = [
    {
      title: "Total Users",
      value: formatCount(OverviewData?.total_users),
      icon: <Users />,
    },
    {
      title: "Active Users",
      value: formatCount(OverviewData?.active_users),
      icon: <UserCheck />,
    },
    {
      title: "Total Posts",
      value: formatCount(OverviewData?.total_posts),
      icon: <FileText />,
    },
    {
      title: "Engagement Rate",
      value: `${OverviewData?.engagement_rate ?? 0}%`,
      trend: engagementChange
        ? `${engagementChange > 0 ? "↑" : "↓"} ${Math.abs(engagementChange)}% from last month`
        : undefined,
      icon: <TrendingUp />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Platform activity at a glance."
        actions={
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full sm:w-72"
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {OverviewDataLoading
          ? Array.from({ length: STAT_CARD_COUNT }, (_, index) => (
              <StatCard key={index} title="" value="" loading />
            ))
          : statsData.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {OverviewDataLoading ? (
        <ChartAndTableSkeleton />
      ) : (
        <>
          <CustomCard
            className="rounded-2xl border-gray-100 shadow-sm"
            contentClassName="p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Engagement Trend
            </h2>
            <div className="h-64">
              <EngagementChart trendData={OverviewData?.trend} />
            </div>
          </CustomCard>

          <RecentReportsTable
            response={OverviewData}
            loading={OverviewDataLoading}
            setPage={setPage}
            page={page}
          />
        </>
      )}
    </div>
  );
};

export default Overview;
