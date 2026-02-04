import {
  AppWindow,
  BadgeCheck,
  Bell,
  ChartPie,
  HandCoins,
  HelpCircle,
  LayoutDashboard,
  PhoneForwarded,
  Settings,
  Star,
  Store,
  User,
} from "lucide-react";

export const links = [
  {
    title: "Main Menu",
    items: [
      {
        name: "Overview",
        href: "/overview",
        icon: LayoutDashboard,
      },
      {
        name: "Users Management",
        href: "/users",
        icon: User,
      },
      {
        name: "Market Place",
        href: "/market",
        icon: Store,
      },
      {
        name: "Content Moderation",
        href: "/content",
        icon: AppWindow,
      },
      {
        name: "Verification",
        href: "/verification",
        icon: BadgeCheck,
      },
      {
        name: "Reports",
        href: "/reports",
        icon: Star,
      },
      {
        name: "Ads",
        href: "/ads",
        icon: ChartPie,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: HandCoins,
      },
      {
        name: "Promotions",
        href: "/promotions",
        icon: PhoneForwarded,
      },
      {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        name: "Help",
        href: "/help",
        icon: HelpCircle,
      },
    ],
  },
];

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  VIEWER: "viewer",
} as const;

export const PERMISSIONS = {
  VIEW_USERS: "view_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
  VIEW_CONTENT: "view_content",
  MODERATE_CONTENT: "moderate_content",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_PAYMENTS: "manage_payments",
  MANAGE_PROMOTIONS: "manage_promotions",
  VIEW_REPORTS: "view_reports",
} as const;
