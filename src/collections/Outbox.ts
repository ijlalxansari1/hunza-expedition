// src/collections/Outbox.ts
import type { CollectionConfig } from 'payload';
import { adminAccess } from '../lib/payloadAccess.ts';

export const Outbox: CollectionConfig = {
  slug: 'outbox',
  labels: {
    singular: 'Outbox Email',
    plural: 'Outbox Delivery Queue',
  },
  admin: {
    useAsTitle: 'enquiryId',
    defaultColumns: ['enquiryId', 'status', 'retryCount', 'updatedAt'],
    group: 'Enquiries & Sales',
    description: 'System email delivery queue for customer and operational notifications.',
  },
  access: {
    create: () => false,
    read: adminAccess,
    update: adminAccess,
    delete: adminAccess,
  },
  fields: [
    { name: 'enquiryId', type: 'relationship', relationTo: 'enquiries', required: true },
    { name: 'emailPayload', type: 'json', required: true },
    { name: 'status', type: 'select', options: ['pending', 'processing', 'sent', 'failed'], defaultValue: 'pending' },
    { name: 'retryCount', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
};
