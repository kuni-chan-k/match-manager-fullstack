import { UserRole, PERMISSIONS } from "./types";

type Permission = keyof typeof PERMISSIONS;

export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const allowedRoles: readonly string[] = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

export function requirePermission(
  userRole: UserRole,
  permission: Permission
): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
