import { PageHeader } from "@/components/app/PageHeader";
import { ChevronRight, KeyRound, ShieldCheck, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface SettingsLink {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const SETTINGS_LINKS: SettingsLink[] = [
  {
    title: "Admin Management",
    description: "Manage admin users and their permissions.",
    href: "/settings/admin-management",
    icon: ShieldCheck,
  },
  {
    title: "Reset Password",
    description: "Change your current password for better security.",
    href: "/settings/reset-password",
    icon: KeyRound,
  },
];

const Settings = () => (
  <div className="space-y-6">
    <PageHeader
      title="Settings & Permissions"
      description="Manage your account settings and administrative permissions."
    />

    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      {SETTINGS_LINKS.map(({ title, description, href, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6F4FA] text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-gray-900">{title}</span>
            <span className="mt-0.5 block text-sm text-gray-500">
              {description}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      ))}
    </div>
  </div>
);

export default Settings;
