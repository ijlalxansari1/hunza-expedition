import {
  hasAdminRole,
  hasOperationsRole,
  hasStaffRole,
  selfOrAdminAccess,
} from '../src/lib/payloadAccess';

describe('Payload role access', () => {
  it('does not grant roles to unauthenticated users', () => {
    expect(hasAdminRole(null)).toBe(false);
    expect(hasStaffRole(null)).toBe(false);
    expect(hasOperationsRole(null)).toBe(false);
  });

  it('keeps content editors out of operations data', () => {
    const editor = { id: 12, role: 'editor' };

    expect(hasStaffRole(editor)).toBe(true);
    expect(hasOperationsRole(editor)).toBe(false);
    expect(hasAdminRole(editor)).toBe(false);
  });

  it('limits non-admin user records to the authenticated user', async () => {
    const user = { id: 12, role: 'agent' };
    const args = { req: { user } } as unknown as Parameters<typeof selfOrAdminAccess>[0];

    expect(selfOrAdminAccess(args)).toEqual({ id: { equals: 12 } });
  });
});