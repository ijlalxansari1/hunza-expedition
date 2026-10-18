import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

const unescoDesignationTypes = new Set([
  'unesco_world_heritage',
  'unesco_tentative_list',
  'unesco_intangible_heritage',
  'unesco_global_geopark',
  'unesco_biosphere_reserve',
  'unesco_other',
]);

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isUnescoUrl(value: unknown): value is string {
  if (!isHttpUrl(value)) return false;
  const url = new URL(value);
  return url.protocol === 'https:' && (url.hostname === 'unesco.org' || url.hostname.endsWith('.unesco.org'));
}

export const OfficialDesignation: CollectionConfig = {
  slug: 'official-designations',
  labels: { singular: 'Official Designation', plural: 'Official Designations' },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'officialName',
    defaultColumns: ['officialName', 'designationType', 'designationStatus', 'verificationStatus', 'publicationStatus'],
    group: 'Travel content',
    description: 'Record official protected-area and UNESCO designations with verification sources.',
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        const type = data.designationType ?? originalDoc?.designationType;
        const designationStatus = data.designationStatus ?? originalDoc?.designationStatus;
        const verificationStatus = data.verificationStatus ?? originalDoc?.verificationStatus;
        const publicationStatus = data.publicationStatus ?? originalDoc?.publicationStatus;
        const officialSourceUrl = data.officialSourceUrl ?? originalDoc?.officialSourceUrl;
        const lastVerifiedAt = data.lastVerifiedAt ?? originalDoc?.lastVerifiedAt;
        const isUnesco = typeof type === 'string' && unescoDesignationTypes.has(type);

        if (type === 'unesco_world_heritage' && designationStatus !== 'inscribed') {
          throw new Error('World Heritage Site designations must have the status “Inscribed”.');
        }
        if (type === 'unesco_tentative_list' && designationStatus !== 'tentative_list') {
          throw new Error('Tentative List entries must use the distinct “Tentative List” status.');
        }
        if (type === 'unesco_intangible_heritage' && designationStatus !== 'recognized_element') {
          throw new Error('Intangible heritage designations must use “Recognized element”.');
        }
        if (
          (type === 'unesco_global_geopark' || type === 'unesco_biosphere_reserve')
          && designationStatus !== 'designated'
        ) {
          throw new Error('UNESCO Geopark and Biosphere Reserve designations must use the “Designated” status.');
        }
        if (isUnesco && !isUnescoUrl(officialSourceUrl)) {
          throw new Error('UNESCO designations require an official source URL on a unesco.org domain.');
        }
        if (!isHttpUrl(officialSourceUrl)) {
          throw new Error('Official designations require a valid HTTP(S) source URL.');
        }
        if (verificationStatus === 'verified' && !lastVerifiedAt) {
          throw new Error('Verified designations require a last-verified date.');
        }
        if (publicationStatus === 'published' && (
          verificationStatus !== 'verified'
          || !lastVerifiedAt
          || !officialSourceUrl
          || designationStatus === 'proposed'
        )) {
          throw new Error('Only verified designations with a source URL and verification date can be published.');
        }

        return data;
      },
    ],
  },
  fields: [
    { name: 'officialName', type: 'text', required: true },
    { name: 'designationType', type: 'select', required: true, options: [
      { label: 'UNESCO World Heritage Site', value: 'unesco_world_heritage' },
      { label: 'UNESCO World Heritage Tentative List', value: 'unesco_tentative_list' },
      { label: 'UNESCO Intangible Cultural Heritage', value: 'unesco_intangible_heritage' },
      { label: 'UNESCO Global Geopark', value: 'unesco_global_geopark' },
      { label: 'UNESCO Biosphere Reserve', value: 'unesco_biosphere_reserve' },
      { label: 'Other UNESCO designation', value: 'unesco_other' },
      { label: 'National protected area', value: 'national_protected_area' },
      { label: 'Other official designation', value: 'other_official' },
    ] },
    { name: 'designationStatus', type: 'select', required: true, options: [
      { label: 'Inscribed', value: 'inscribed' },
      { label: 'Tentative List', value: 'tentative_list' },
      { label: 'Recognized intangible element', value: 'recognized_element' },
      { label: 'Designated', value: 'designated' },
      { label: 'Proposed / not verified', value: 'proposed' },
    ] },
    { name: 'geographicArea', type: 'text', required: true },
    { name: 'countryOrArea', type: 'text', required: true },
    { name: 'officialSourceUrl', type: 'text', required: true },
    { name: 'verificationStatus', type: 'select', required: true, defaultValue: 'pending', options: [
      { label: 'Pending verification', value: 'pending' },
      { label: 'Verified', value: 'verified' },
      { label: 'Not verified', value: 'not_verified' },
      { label: 'Rejected', value: 'rejected' },
    ] },
    { name: 'lastVerifiedAt', type: 'date' },
    { name: 'editorialNotes', type: 'textarea', admin: { description: 'Internal notes; never shown publicly.' } },
    { name: 'relatedPlaces', type: 'relationship', relationTo: 'places', hasMany: true },
    { name: 'relatedExperiences', type: 'relationship', relationTo: 'experiences', hasMany: true },
    { name: 'relatedArticles', type: 'relationship', relationTo: 'articles', hasMany: true },
    {
      name: 'publicationStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'published'],
    },
  ],
};
