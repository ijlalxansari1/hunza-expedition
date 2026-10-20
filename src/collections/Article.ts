import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Article: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Guide / Blog Post',
    plural: 'Guides & Blog Posts',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contentType', 'category', 'publicationStatus', 'updatedAt'],
    group: 'Stories, Guides & Pages',
    preview: (doc) => {
      if (typeof doc.slug !== 'string') return null;
      const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
      return `${baseUrl}/api/preview?slug=${encodeURIComponent(doc.slug)}`;
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'contentType',
      type: 'select',
      required: true,
      defaultValue: 'guide',
      options: [
        { label: 'Travel guide', value: 'guide' },
        { label: 'Blog post', value: 'blog' },
      ],
    },
    { name: 'category', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    {
      name: 'richContent',
      type: 'richText',
      editor: lexicalEditor(),
      admin: { description: 'Format the full article using headings, lists, links, and emphasis.' },
    },
    { name: 'content', type: 'textarea', admin: { description: 'Legacy plain-text article content. Use rich content for new posts.' } },
    { name: 'imageUrl', type: 'text', required: true },
    { name: 'imageAlt', type: 'text' },
    { name: 'imageCaption', type: 'textarea' },
    { name: 'readTimeMinutes', type: 'number', required: true, min: 1 },
    { name: 'author', type: 'text' },
    {
      name: 'authorProfile',
      type: 'relationship',
      relationTo: 'authors',
      admin: { description: 'Select a managed author profile; the name field above remains as a legacy fallback.' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'relatedDestinations', type: 'json', defaultValue: [] },
    { name: 'relatedTours', type: 'json', defaultValue: [] },
    { name: 'relatedPlaces', type: 'json', defaultValue: [] },
    { name: 'relatedExperiences', type: 'json', defaultValue: [] },
    { name: 'relatedArticles', type: 'json', defaultValue: [] },
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
