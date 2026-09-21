import { ROLES } from "@/lib/contant";
import { useAuthStore } from "@/store/authStore";

export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: string): boolean =>
    user?.permissions?.includes(permission) ?? false;

  const hasRole = (role: string): boolean => user?.role === role;

  const hasAnyRole = (roles: string[]): boolean =>
    !!user?.role && roles.includes(user.role);

  const isSuperAdmin = (): boolean => {
    return hasRole(ROLES.SUPER_ADMIN);
  };

  const isAdmin = (): boolean => {
    return hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
  };
};
