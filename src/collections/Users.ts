import type { CollectionConfig } from 'payload';
import {
  adminAccess,
  hasAdminRole,
  hasStaffRole,
  selfOrAdminAccess,
} from '../lib/payloadAccess.ts';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    admin: ({ req }) => hasStaffRole(req.user),
    create: adminAccess,
    read: selfOrAdminAccess,
    update: selfOrAdminAccess,
    delete: adminAccess,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Operations', value: 'agent' },
      ],
      defaultValue: 'admin',
      required: true,
      access: {
        create: ({ req }) => hasAdminRole(req.user),
        update: ({ req }) => hasAdminRole(req.user),
      },
    },
  ],
};
