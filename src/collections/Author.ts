import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const Author: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Author Profile', plural: 'Author Profiles' },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'publicationStatus', 'updatedAt'],
    group: 'Travel content',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'biography', type: 'textarea', required: true },
    { name: 'imageUrl', type: 'text' },
    { name: 'imageAlt', type: 'text' },
    { name: 'websiteUrl', type: 'text' },
    { name: 'socialLinks', type: 'json', defaultValue: [] },
    {
      name: 'publicationStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'published'],
    },
  ],
};
