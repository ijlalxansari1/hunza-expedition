import type { Access, CollectionConfig } from 'payload';
import { hasAdminRole, hasStaffRole } from '../lib/payloadAccess.ts';

export const publishedContentReadAccess: Access = ({ req }) => (
  hasStaffRole(req.user) ? true : { publicationStatus: { equals: 'published' } }
);

export const staffContentWriteAccess: Pick<
  NonNullable<CollectionConfig['access']>,
  'create' | 'update' | 'delete'
> = {
  create: ({ req }) => hasStaffRole(req.user),
  update: ({ req }) => hasStaffRole(req.user),
  delete: ({ req }) => hasAdminRole(req.user),
};
