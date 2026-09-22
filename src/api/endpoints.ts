/** Every backend path the admin app calls, relative to `API_BASE_URL`. */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login/",
    refresh: "/auth/refresh_token/",
    logout: "/auth/logout/",
    changePassword: "/auth/change-password/",
    /** The signed-in admin's own profile. */
    profile: "/admin/profile/",
  },
  overview: "/admin/overview/",
  admins: {
    list: "/admin/team/",
    detail: (id: string) => `/admin/team/${id}/`,
    suspend: (id: string) => `/admin/suspend/${id}/`,
  },
  users: {
    list: "/admin/users/",
    detail: (id: string) => `/admin/user/${id}/`,
    content: (id: string) => `/admin/user_content/${id}/`,
    suspend: (id: string) => `/admin/suspend/${id}/`,
    removeBadge: (id: string) => `/admin/remove_badge/${id}/`,
  },
  groups: {
    list: "/admin/groups/",
  },
  content: {
    list: "/admin/content/",
    deletePost: (id: string | number) => `/admin/delete_post/${id}/`,
    deleteProduct: (id: string | number) => `/admin/delete_product/${id}/`,
    deleteReview: (id: string | number) => `/admin/delete_review/${id}/`,
    postDetail: (id: string) => `/admin/post/${id}/`,
    productDetail: (id: string) => `/admin/product/${id}/`,
  },
  marketplace: {
    list: "/admin/marketplace/",
    productDecision: (id: number, action: "approve" | "reject") =>
      `/admin/product_${action}/${id}/`,
  },
  notifications: {
    list: "/admin/broadcast/",
    detail: (id: string) => `/admin/single_broadcast/${id}`,
  },
  reports: {
    list: "/admin/reports/",
    resolve: (id: string) => `/admin/resolve_report/${id}/`,
  },
  payments: {
    list: "/admin/payments/",
  },
  verifications: {
    list: "/admin/verifications/",
    decision: (id: string, decision: "accept" | "reject") =>
      `/admin/verification_${decision}/${id}`,
  },
  badges: {
    list: "/admin/verification_badges/",
    detail: (id: string) => `/admin/verification_badges/${id}/`,
  },
} as const;
