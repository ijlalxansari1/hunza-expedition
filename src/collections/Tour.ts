import type { Access, CollectionConfig } from 'payload';
import { hasAdminRole, hasStaffRole } from '../lib/payloadAccess.ts';

const readAccess: Access = ({ req }) => (
  hasStaffRole(req.user) ? true : { publicationStatus: { equals: 'published' } }
);

export const Tour: CollectionConfig = {
  slug: 'tours',
  access: {
    create: ({ req }) => hasStaffRole(req.user),
    read: readAccess,
    update: ({ req }) => hasStaffRole(req.user),
    delete: ({ req }) => hasAdminRole(req.user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'durationDays', 'publicationStatus'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortSummary', type: 'textarea', required: true },
    { name: 'fullDescription', type: 'textarea', required: true },
    { name: 'heroImageUrl', type: 'text', required: true },
    { name: 'galleryUrls', type: 'json', defaultValue: [] },
    { name: 'destinations', type: 'json', required: true, defaultValue: [] },
    { name: 'durationDays', type: 'number', required: true, min: 1 },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: ['Gentle', 'Moderate', 'Challenging', 'Strenuous'],
    },
    { name: 'activityCategories', type: 'json', defaultValue: [] },
    { name: 'travelStyle', type: 'text', required: true },
    { name: 'season', type: 'text', required: true },
    { name: 'itinerary', type: 'json', required: true, defaultValue: [] },
    { name: 'price', type: 'number', min: 0 },
    { name: 'currency', type: 'text' },
    { name: 'pricingBasis', type: 'text' },
    { name: 'isPriceConfirmed', type: 'checkbox', required: true, defaultValue: false },
    { name: 'inclusions', type: 'json', defaultValue: [] },
    { name: 'exclusions', type: 'json', defaultValue: [] },
    { name: 'packingRequirements', type: 'json', defaultValue: [] },
    { name: 'safetyNotes', type: 'textarea' },
    {
      name: 'publicationStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'published'],
    },
    { name: 'seoTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
};
