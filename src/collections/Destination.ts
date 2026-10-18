import type { Access, CollectionConfig } from 'payload';
import { hasAdminRole, hasStaffRole } from '../lib/payloadAccess.ts';

const readAccess: Access = ({ req }) => (
  hasStaffRole(req.user) ? true : { publicationStatus: { equals: 'published' } }
);

export const Destination: CollectionConfig = {
  slug: 'destinations',
  access: {
    create: ({ req }) => hasStaffRole(req.user),
    read: readAccess,
    update: ({ req }) => hasStaffRole(req.user),
    delete: ({ req }) => hasAdminRole(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'region', 'publicationStatus'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'region', type: 'text', required: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'overview', type: 'textarea', required: true },
    { name: 'heroImageUrl', type: 'text', required: true },
    { name: 'galleryUrls', type: 'json', defaultValue: [] },
    { name: 'coordinates', type: 'json' },
    { name: 'placesOfInterest', type: 'json', defaultValue: [] },
    { name: 'bestTimeToVisit', type: 'json' },
    { name: 'transportNotes', type: 'textarea' },
    { name: 'practicalInfo', type: 'json', defaultValue: [] },
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
