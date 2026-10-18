// src/collections/Enquiry.ts
import type { CollectionConfig } from 'payload';
import { afterChangeHook } from '../hooks/enquiryAfterChange.ts';
import { adminAccess, operationsAccess } from '../lib/payloadAccess.ts';

export const Enquiry: CollectionConfig = {
  slug: 'enquiries',
  access: {
    create: operationsAccess,
    read: operationsAccess,
    update: operationsAccess,
    delete: adminAccess,
  },
  fields: [
    { name: 'referenceId', type: 'text', required: true, unique: true },
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'preferredContact',
      type: 'select',
      required: true,
      defaultValue: 'email',
      options: ['email', 'whatsapp', 'phone'],
    },
    { name: 'countryOfResidence', type: 'text' },
    { name: 'startDate', type: 'text' },
    {
      name: 'dateFlexibility',
      type: 'select',
      required: true,
      defaultValue: 'flexible_few_days',
      options: ['exact', 'flexible_few_days', 'flexible_month'],
    },
    { name: 'durationDays', type: 'number', required: true, defaultValue: 7 },
    { name: 'adultsCount', type: 'number', required: true, defaultValue: 2 },
    { name: 'childrenCount', type: 'number', required: true, defaultValue: 0 },
    { name: 'childrenAges', type: 'text' },
    { name: 'budgetPerPerson', type: 'text' },
    {
      name: 'budgetCurrency',
      type: 'select',
      required: true,
      defaultValue: 'USD',
      options: ['USD', 'EUR', 'GBP', 'PKR'],
    },
    {
      name: 'accommodationStyle',
      type: 'select',
      required: true,
      defaultValue: 'comfort_hotels',
      options: ['standard_guesthouse', 'comfort_hotels', 'heritage_boutique', 'flexible'],
    },
    { name: 'selectedDestinations', type: 'json', required: true, defaultValue: [] },
    { name: 'selectedInterests', type: 'json', required: true, defaultValue: [] },
    { name: 'specialRequests', type: 'textarea' },
    { name: 'privacyConsent', type: 'checkbox', required: true, defaultValue: false },
    { name: 'submittedAt', type: 'date', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        'new',
        'under_review',
        'preparing_quotation',
        'quotation_sent',
        'confirmed_manual',
        'closed',
        'not_feasible',
      ],
    },
    { name: 'internalNotes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [afterChangeHook],
  },
};
