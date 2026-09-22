/**
 * Query keys are hierarchical: invalidating a domain's `all` key also
 * invalidates every list and detail query nested beneath it.
 */
export const queryKeys = {
  profile: ["profile", "me"] as const,
  overview: {
    all: ["overview"] as const,
    summary: (params: object) => ["overview", params] as const,
  },
  admins: {
    all: ["admins"] as const,
    list: (params: object) => ["admins", "list", params] as const,
    detail: (id: string | null) => ["admins", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: object) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    content: (id: string, params: object) =>
      ["users", "content", id, params] as const,
  },
  groups: {
    all: ["groups"] as const,
    list: (params: object) => ["groups", "list", params] as const,
  },
  content: {
    all: ["content"] as const,
    list: (params: object) => ["content", "list", params] as const,
    detail: (kind: "post" | "product", id: string) =>
      ["content", "detail", kind, id] as const,
  },
  marketplace: {
    all: ["marketplace"] as const,
    list: (params: object) => ["marketplace", "list", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: object) => ["notifications", "list", params] as const,
    detail: (id: string | null | undefined) =>
      ["notifications", "detail", id] as const,
  },
  reports: {
    all: ["reports"] as const,
    list: (params: object) => ["reports", "list", params] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (params: object) => ["payments", "list", params] as const,
  },
  verifications: {
    all: ["verifications"] as const,
    list: (params: object) => ["verifications", "list", params] as const,
  },
  badges: {
    all: ["verification-badges"] as const,
    list: (params: object) => ["verification-badges", "list", params] as const,
  },
};
