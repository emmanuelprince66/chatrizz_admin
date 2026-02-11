import AdminManagementPage from "@/components/app/admin/AdminManagement";
import ResetPassword from "@/components/app/settings/ResetPassword";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoutes";
import Ads from "@/pages/Ads";
import { Login } from "@/pages/auth/Login";
import Content from "@/pages/Content";
import Help from "@/pages/Help";
import Market from "@/pages/Market";
import Notification from "@/pages/Notification";
import Overview from "@/pages/Overview";
import Payments from "@/pages/Payments";
import Profile from "@/pages/Profile";
import Promotion from "@/pages/Promotion";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Verification from "@/pages/Verification";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Placeholder pages
// const PlaceholderPage = ({ title }: { title: string }) => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold">{title}</h1>
//     <p className="text-muted-foreground">This page is under construction.</p>
//   </div>
// );

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "users",
        element: <Profile />,
      },
      {
        path: "market",
        element: <Market />,
      },
      {
        path: "content",
        element: <Content />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "ads",
        element: <Ads />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "promotions",
        element: <Promotion />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "settings/admin-management",
        element: <AdminManagementPage />,
      },
      {
        path: "settings/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "help",
        element: <Help />,
      },
    ],
  },
]);
