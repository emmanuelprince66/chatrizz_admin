import { ROLES } from "@/lib/contant";
import { useAuthStore } from "@/store/authStore";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

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
