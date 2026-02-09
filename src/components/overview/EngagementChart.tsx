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
import { TrendingUp } from "lucide-react";
import { useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";

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

interface TrendData {
  posts?: Array<{ day: string; count: number }>;
  comments?: Array<{ day: string; count: number }>;
  likes?: Array<{ day: string; count: number }>;
  shares?: Array<{ day: string; count: number }>;
}

interface EngagementChartProps {
  trendData?: TrendData;
}

const EmptyChartState = () => (
  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
    <div className="w-16 h-16 mb-4 flex items-center justify-center">
      <TrendingUp className="w-full h-full" strokeWidth={1.5} />
    </div>
    <p className="text-lg font-medium text-gray-500">
      No engagement data available
    </p>
    <p className="text-sm mt-2 text-gray-400">
      Data will appear here once available
    </p>
  </div>
);

const EngagementChart = ({ trendData }: EngagementChartProps) => {
  const chartRef = useRef<Chart<"line"> | null>(null);

  // Process and merge all trend data by date
  const processedData = useMemo(() => {
    if (!trendData) return [];

    // Create a map to store all data points by date
    const dataMap = new Map<
      string,
      {
        date: string;
        posts: number;
        comments: number;
        likes: number;
        shares: number;
      }
    >();

    // Process posts
    trendData.posts?.forEach((item) => {
      const date = new Date(item.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dataMap.has(item.day)) {
        dataMap.set(item.day, {
          date,
          posts: 0,
          comments: 0,
          likes: 0,
          shares: 0,
        });
      }
      dataMap.get(item.day)!.posts = item.count;
    });

    // Process comments
    trendData.comments?.forEach((item) => {
      const date = new Date(item.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dataMap.has(item.day)) {
        dataMap.set(item.day, {
          date,
          posts: 0,
          comments: 0,
          likes: 0,
          shares: 0,
        });
      }
      dataMap.get(item.day)!.comments = item.count;
    });

    // Process likes
    trendData.likes?.forEach((item) => {
      const date = new Date(item.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dataMap.has(item.day)) {
        dataMap.set(item.day, {
          date,
          posts: 0,
          comments: 0,
          likes: 0,
          shares: 0,
        });
      }
      dataMap.get(item.day)!.likes = item.count;
    });

    // Process shares
    trendData.shares?.forEach((item) => {
      const date = new Date(item.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dataMap.has(item.day)) {
        dataMap.set(item.day, {
          date,
          posts: 0,
          comments: 0,
          likes: 0,
          shares: 0,
        });
      }
      dataMap.get(item.day)!.shares = item.count;
    });

    // Convert map to sorted array
    return Array.from(dataMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([, value]) => value);
  }, [trendData]);

  // If no data, show empty state
  if (!processedData || processedData.length === 0) {
    return <EmptyChartState />;
  }

  const data = {
    labels: processedData.map((item) => item.date),
    datasets: [
      {
        label: "Posts",
        data: processedData.map((item) => item.posts),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Comments",
        data: processedData.map((item) => item.comments),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Likes",
        data: processedData.map((item) => item.likes),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Shares",
        data: processedData.map((item) => item.shares),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} ref={chartRef} />
    </div>
  );
};

export default EngagementChart;
