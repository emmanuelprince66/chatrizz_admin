import {
  useFetchVerificationBadgesQuery,
  type BadgeType,
  type BillingPeriod,
  type Currency,
  type VerificationBadge,
} from "@/api/verification/fetch-badges";
import { useVerificationBadgeMutations } from "@/api/verification/badge-actions";
import { getApiErrorMessage } from "@/api/utils";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import { CustomModal } from "@/components/app/CustomModal";
import { CustomTable } from "@/components/app/CustomTable";
import { PageHeader } from "@/components/app/PageHeader";
import { ResultsCount } from "@/components/app/ResultsCount";
import { SearchInput } from "@/components/app/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const currencies: Currency[] = ["NGN", "GHS", "GBP", "USD", "KES"];
const badgeTypes: BadgeType[] = ["INDIVIDUAL", "BUSINESS", "ORGANIZATION"];

type FormState = {
  type: BadgeType;
  rank: string;
  billingPeriod: BillingPeriod;
  prices: Record<Currency, string>;
};

const emptyForm: FormState = {
  type: "INDIVIDUAL",
  rank: "",
  billingPeriod: "monthly",
  prices: { NGN: "", GHS: "", GBP: "", USD: "", KES: "" },
};

const labelize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const Subscriptions = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VerificationBadge>();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<VerificationBadge>();
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, isError } = useFetchVerificationBadgesQuery({
    search: debouncedSearch || undefined,
    page: 1,
    limit: 15,
  });
  const mutations = useVerificationBadgeMutations();
  const isSaving = mutations.create.isPending || mutations.update.isPending;

  const openCreate = () => {
    setEditing(undefined);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = useCallback((badge: VerificationBadge) => {
    const plan = badge.plans[0];
    const prices = currencies.reduce(
      (result, currency) => {
        result[currency] =
          plan?.prices.find((price) => price.currency === currency)?.amount ?? "";
        return result;
      },
      { ...emptyForm.prices },
    );
    setEditing(badge);
    setForm({
      type: badge.type,
      rank: badge.rank?.toString() ?? "",
      billingPeriod: plan?.billing_period ?? "monthly",
      prices,
    });
    setDialogOpen(true);
  }, []);

  const submit = async () => {
    const payload = {
      type: form.type,
      rank: form.rank ? Number(form.rank) : null,
      plans: [
        {
          billing_period: form.billingPeriod,
          prices: currencies
            .filter((currency) => form.prices[currency].trim())
            .map((currency) => ({
              currency,
              amount: form.prices[currency].trim(),
            })),
        },
      ],
    };

    try {
      if (editing) {
        await mutations.update.mutateAsync({ id: editing.id, payload });
      } else {
        await mutations.create.mutateAsync(payload);
      }
      toast.success(
        editing
          ? "Subscription updated successfully"
          : "Subscription created successfully",
      );
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Unable to save subscription. Please try again."),
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mutations.remove.mutateAsync(deleteTarget.id);
      toast.success("Subscription deleted successfully");
      setDeleteTarget(undefined);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete subscription."));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Badge type",
        cell: ({ row }: { row: { original: VerificationBadge } }) => (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            {labelize(row.original.type)}
          </Badge>
        ),
      },
      {
        id: "monthly",
        header: "Monthly",
        cell: ({ row }: { row: { original: VerificationBadge } }) =>
          row.original.plans.find((plan) => plan.billing_period === "monthly")
            ?.prices.length ?? 0,
      },
      {
        id: "yearly",
        header: "Yearly",
        cell: ({ row }: { row: { original: VerificationBadge } }) =>
          row.original.plans.find((plan) => plan.billing_period === "yearly")
            ?.prices.length ?? 0,
      },
      { accessorKey: "rank", header: "Rank" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: VerificationBadge } }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Edit subscription"
              onClick={() => openEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete subscription"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    [openEdit],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Subscriptions"
        description="Manage badge plans and prices across supported currencies."
        actions={
          <>
            <SearchInput
              placeholder="Search subscriptions..."
              value={search}
              onValueChange={setSearch}
              className="w-full sm:w-72"
            />
            <Button onClick={openCreate} className="h-10 w-full rounded-full px-5 sm:w-auto">
              <Plus />
              Add subscription
            </Button>
          </>
        }
      />

      <ResultsCount
        loading={isLoading}
        shown={data?.results.length ?? 0}
        total={data?.count ?? 0}
        label="subscription plans"
      />

      <CustomTable
        columns={columns}
        data={data?.results ?? []}
        loading={isLoading}
        showSerialNumber={false}
        noDataText={
          isError
            ? "Unable to load subscriptions."
            : "No subscription plans found."
        }
      />

      <CustomModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit subscription" : "Add subscription"}
        preventClose={isSaving}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              disabled={isSaving}
              onClick={submit}
              className="px-5"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create subscription"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge type</Label>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as BadgeType })
                }
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
              >
                {badgeTypes.map((type) => (
                  <option key={type} value={type}>{labelize(type)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Rank</Label>
              <Input
                type="number"
                value={form.rank}
                onChange={(event) => setForm({ ...form, rank: event.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Billing period</Label>
            <select
              value={form.billingPeriod}
              onChange={(event) =>
                setForm({
                  ...form,
                  billingPeriod: event.target.value as BillingPeriod,
                })
              }
              className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="space-y-3">
            <Label>Prices</Label>
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((currency) => (
                <div key={currency} className="space-y-1">
                  <Label className="text-xs text-gray-500">{currency}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.prices[currency]}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        prices: { ...form.prices, [currency]: event.target.value },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CustomModal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={confirmDelete}
        title="Delete subscription?"
        message={`This will remove the ${
          deleteTarget ? labelize(deleteTarget.type) : ""
        } plan.`}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmIcon={Trash2}
        isPending={mutations.remove.isPending}
      />
    </div>
  );
};

export default Subscriptions;
