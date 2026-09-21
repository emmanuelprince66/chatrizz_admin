import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CustomModal } from "./CustomModal";

export type ConfirmTone = "danger" | "warning" | "primary";

const TONE_STYLES: Record<
  ConfirmTone,
  { button: string; notice: string; noticeIcon: string; NoticeIcon: LucideIcon }
> = {
  danger: {
    button: "bg-red-600 text-white hover:bg-red-700",
    notice: "border-red-200 bg-red-50 text-red-700",
    noticeIcon: "text-red-600",
    NoticeIcon: AlertTriangle,
  },
  warning: {
    button: "bg-orange-600 text-white hover:bg-orange-700",
    notice: "border-orange-200 bg-orange-50 text-orange-700",
    noticeIcon: "text-orange-600",
    NoticeIcon: AlertTriangle,
  },
  primary: {
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    notice: "border-blue-200 bg-blue-50 text-blue-700",
    noticeIcon: "text-blue-600",
    NoticeIcon: Info,
  },
};

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  message: ReactNode;
  /** Highlighted callout under the message, coloured by `tone`. */
  notice?: { title?: string; text: ReactNode };
  /** Extra content shown between the message and the notice. */
  children?: ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  confirmIcon?: LucideIcon;
  tone?: ConfirmTone;
  isPending?: boolean;
}

/** Standard "are you sure?" dialog built on CustomModal. */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  notice,
  children,
  confirmLabel,
  pendingLabel = "Processing...",
  cancelLabel = "Cancel",
  confirmIcon: ConfirmIcon,
  tone = "danger",
  isPending = false,
}: ConfirmModalProps) {
  const styles = TONE_STYLES[tone];
  const { NoticeIcon } = styles;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      preventClose={isPending}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={styles.button}
          >
            {isPending ? (
              <Spinner size="sm" color="text-white" />
            ) : (
              ConfirmIcon && <ConfirmIcon />
            )}
            {isPending ? pendingLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{message}</p>
        {children}
        {notice && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-lg border p-4",
              styles.notice,
            )}
          >
            <NoticeIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", styles.noticeIcon)}
            />
            <div className="text-xs">
              {notice.title && <p className="font-medium">{notice.title}</p>}
              <p className={cn(notice.title && "mt-1")}>{notice.text}</p>
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
}
