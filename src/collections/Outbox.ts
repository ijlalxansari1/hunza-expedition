// src/collections/Outbox.ts
import type { CollectionConfig } from 'payload';

export const Outbox: CollectionConfig = {
  slug: 'outbox',
  fields: [
    { name: 'enquiryId', type: 'relationship', relationTo: 'enquiries', required: true },
    { name: 'emailPayload', type: 'json', required: true },
    { name: 'status', type: 'select', options: ['pending', 'processing', 'sent', 'failed'], defaultValue: 'pending' },
    { name: 'retryCount', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
};
