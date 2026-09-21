import { useChangePasswordMutation } from "@/api/auth/change-password";
import { getApiErrorMessage } from "@/api/utils";
import { BackLink } from "@/components/app/BackLink";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

// Matches the backend ChangePassword serializer.
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 68;

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  disabled?: boolean;
}

const PasswordField = ({
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={MAX_PASSWORD_LENGTH}
        disabled={disabled}
        className="border-gray-200 bg-gray-50 pl-10 pr-10"
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};

const validate = (current: string, next: string, confirm: string) => {
  if (!current) return "Enter your current password.";
  if (next.length < MIN_PASSWORD_LENGTH) {
    return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (next !== confirm) return "Passwords do not match.";
  if (next === current) {
    return "New password must be different from the current one.";
  }
  return null;
};

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangePasswordMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validate(currentPassword, newPassword, confirmPassword);
    if (error) {
      toast.error(error);
      return;
    }

    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(mutationError, "Unable to update password."),
          );
        },
      },
    );
  };

  const isPending = changePassword.isPending;

  return (
    <div className="space-y-6">
      <BackLink to="/settings" label="Settings" />
      <PageHeader
        title="Reset Password"
        description="Make sure it's something strong but memorable."
      />

      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Current Password"
            autoComplete="current-password"
            disabled={isPending}
          />
          <PasswordField
            value={newPassword}
            onChange={setNewPassword}
            placeholder="New Password"
            autoComplete="new-password"
            disabled={isPending}
          />
          <PasswordField
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm Password"
            autoComplete="new-password"
            disabled={isPending}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="mt-6 h-10 w-full"
          >
            {isPending && <Spinner size="sm" color="text-white" />}
            {isPending ? "Saving..." : "Save Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
