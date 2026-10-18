import type { Access } from 'payload';

const staffRoles = ['admin', 'editor', 'agent'] as const;
const operationsRoles = ['admin', 'agent'] as const;

function hasRole(user: unknown, roles: readonly string[]): boolean {
  if (typeof user !== 'object' || user === null || !('role' in user)) {
    return false;
  }

  const role = (user as { role?: unknown }).role;
  return typeof role === 'string' && roles.includes(role);
}

export function hasAdminRole(user: unknown): boolean {
  return hasRole(user, ['admin']);
}

export function hasStaffRole(user: unknown): boolean {
  return hasRole(user, staffRoles);
}

export function hasOperationsRole(user: unknown): boolean {
  return hasRole(user, operationsRoles);
}

export const staffAccess: Access = ({ req }) => hasStaffRole(req.user);
export const adminAccess: Access = ({ req }) => hasAdminRole(req.user);
export const operationsAccess: Access = ({ req }) => hasOperationsRole(req.user);

export const selfOrAdminAccess: Access = ({ req }) => {
  if (hasAdminRole(req.user)) {
    return true;
  }

  if (!req.user || typeof req.user !== 'object' || !('id' in req.user)) {
    return false;
  }

  const userId = (req.user as { id?: unknown }).id;
  if (typeof userId !== 'number' && typeof userId !== 'string') {
    return false;
  }

  return { id: { equals: userId } };
};