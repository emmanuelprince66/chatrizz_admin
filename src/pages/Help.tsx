import { PageHeader } from "@/components/app/PageHeader";
import { LifeBuoy } from "lucide-react";

const Help = () => (
  <div className="space-y-6">
    <PageHeader
      title="Help"
      description="Guides and support for the Chatrizz admin dashboard."
    />

    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4FA] text-primary">
        <LifeBuoy className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Help center coming soon
      </h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Documentation for moderation, verification and payments will appear
        here.
      </p>
    </div>
  </div>
);

export default Help;
