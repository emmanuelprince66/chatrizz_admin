import type {
  AdminVerification,
  VerificationStatus,
} from "@/api/verification/fetch-verifications";
import type { VerificationDecision } from "@/api/verification/verification-actions";
import {
  DetailList,
  DetailRow,
  DetailsSheet,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_DATE_FORMAT,
  PANEL_SUCCESS_BUTTON,
  PanelActionRow,
  PanelBadge,
  PanelEmptyState,
  PanelSection,
  PersonRow,
} from "@/components/app/details-panel";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/util/format-date";
import { Check, ChevronRight, FileText, Link2, X } from "lucide-react";

const STATUS_TONE: Record<VerificationStatus, "green" | "yellow" | "red"> = {
  APPROVED: "green",
  PENDING: "yellow",
  REJECTED: "red",
};

const capitalize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

interface VerificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verification?: AdminVerification;
  onDecision: (decision: VerificationDecision) => void;
  isDecisionPending: boolean;
  pendingDecision?: VerificationDecision;
}

const VerificationDrawer = ({
  open,
  onOpenChange,
  verification,
  onDecision,
  isDecisionPending,
  pendingDecision,
}: VerificationDrawerProps) => {
  if (!verification) return null;

  const { user, status } = verification;
  const documents = [
    { label: "Government ID", url: verification.goverment_id },
    { label: "Business document", url: verification.business_document },
    { label: "Social media profile", url: verification.social_media },
  ].filter((document): document is { label: string; url: string } => !!document.url);

  return (
    <DetailsSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Verification details"
      badge={<PanelBadge tone={STATUS_TONE[status]}>{capitalize(status)}</PanelBadge>}
      description={`Submitted ${formatDate(verification.created_at, PANEL_DATE_FORMAT)}`}
      footer={
        <PanelActionRow>
          <Button
            variant="outline"
            onClick={() => onDecision("accept")}
            disabled={isDecisionPending || status === "APPROVED"}
            className={PANEL_SUCCESS_BUTTON}
          >
            {pendingDecision === "accept" && isDecisionPending ? (
              <Spinner size="sm" />
            ) : (
              <Check />
            )}
            {status === "APPROVED" ? "Approved" : "Approve"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onDecision("reject")}
            disabled={isDecisionPending || status === "REJECTED"}
            className={PANEL_DANGER_BUTTON}
          >
            {pendingDecision === "reject" && isDecisionPending ? (
              <Spinner size="sm" />
            ) : (
              <X />
            )}
            {status === "REJECTED" ? "Rejected" : "Reject"}
          </Button>
        </PanelActionRow>
      }
    >
      <PanelSection title="Applicant">
        <PersonRow
          person={{
            id: user.id,
            name: user.full_name,
            username: user.username,
          }}
        />
        <DetailList>
          <DetailRow label="Email">{user.email || "Not provided"}</DetailRow>
          <DetailRow label="Username">
            {user.username ? `@${user.username}` : "Not set"}
          </DetailRow>
        </DetailList>
        {user.bio?.trim() && <NoteBlock label="Bio">{user.bio}</NoteBlock>}
      </PanelSection>

      <PanelSection title="Application">
        <DetailList>
          <DetailRow label="Badge type">{capitalize(verification.type)}</DetailRow>
          <DetailRow label="Status">{capitalize(status)}</DetailRow>
          <DetailRow label="NIN">
            {verification.nin ? (
              <span className="font-mono text-xs">{verification.nin}</span>
            ) : (
              "Not provided"
            )}
          </DetailRow>
        </DetailList>
      </PanelSection>

      <PanelSection title="Submitted documents">
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((document) => {
              const Icon = document.label.startsWith("Social") ? Link2 : FileText;
              return (
                <a
                  key={document.label}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:border-primary/40 hover:bg-[#F5FAFD]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6F4FA] text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-900">
                      {document.label}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      Opens in a new tab
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              );
            })}
          </div>
        ) : (
          <PanelEmptyState
            title="No documents"
            description="The applicant hasn't submitted any documents."
          />
        )}
      </PanelSection>
    </DetailsSheet>
  );
};

export default VerificationDrawer;
