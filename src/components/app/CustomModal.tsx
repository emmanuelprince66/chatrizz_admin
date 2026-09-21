import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Rendered in a separated bar at the bottom, right-aligned (usually action buttons). */
  footer?: ReactNode;
  size?: ModalSize;
  /** Keeps the title for screen readers but hides it visually. */
  hideTitle?: boolean;
  /** Blocks closing via Escape, overlay click or the close button, e.g. while a request runs. */
  preventClose?: boolean;
  className?: string;
  bodyClassName?: string;
}

/** The app's single modal. Header, body and footer share consistent padding. */
export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  hideTitle = false,
  preventClose = false,
  className,
  bodyClassName,
}: CustomModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && !preventClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!preventClose}
        // Radix warns when a dialog has no description unless this is explicitly unset.
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <DialogHeader
          className={cn(
            "px-6 pt-6 pb-4 pr-12 text-left",
            hideTitle && "sr-only",
          )}
        >
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-gray-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div
          className={cn(
            "flex-1 overflow-y-auto px-6 pb-6",
            hideTitle && "pt-6",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && (
          <DialogFooter className="gap-3 border-t border-gray-100 px-6 py-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
