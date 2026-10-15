// src/collections/Enquiry.ts
import type { CollectionConfig } from 'payload';
import { afterChangeHook } from '../hooks/enquiryAfterChange';

export const Enquiry: CollectionConfig = {
  slug: 'enquiries',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
    // No direct outbox FK – relationship is stored on Outbox side.
  ],
  hooks: {
    afterChange: [afterChangeHook],
  },
};
