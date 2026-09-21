import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/** "← Back to X" link shown above the header on sub-pages. */
export const BackLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
  >
    <ArrowLeft className="h-4 w-4" />
    Back to {label}
  </Link>
);
