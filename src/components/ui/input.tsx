import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

function Input({
  className,
  type,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPasswordField && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-[#0892D0] selection:text-white",
          "flex w-full min-w-0 rounded-md bg-[#E6F4FA] px-4 text-base shadow-xs transition-all outline-none",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "h-12 border-0 focus:border-0 focus:outline-none focus:ring-2 focus:ring-[#0677A1]",
          "aria-invalid:ring-[#D04848]/20 dark:aria-invalid:ring-[#D04848]/40",
          leftIcon ? "pl-10" : "",
          rightIcon || (isPasswordField && showPasswordToggle) ? "pr-10" : "",
          className
        )}
        {...props}
      />

      {/* Left Icon */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A9CC1] pointer-events-none">
          {leftIcon}
        </div>
      )}

      {/* Right Icon */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A9CC1] pointer-events-none">
          {rightIcon}
        </div>
      )}

      {/* Password toggle */}
      {isPasswordField && showPasswordToggle && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A9CC1] hover:text-[#0677A1]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
