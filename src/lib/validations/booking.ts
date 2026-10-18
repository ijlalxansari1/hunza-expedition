import { z } from 'zod';

export const bookingRequestSchema = z.object({
  website_field: z.string().max(0).optional(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  countryOfResidence: z.string().max(80).optional().or(z.literal('')),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  dateFlexibility: z.enum(['exact', 'flexible_few_days', 'flexible_month']),
  adultsCount: z.number().int().min(1).max(30),
  childrenCount: z.number().int().min(0).max(20),
  childrenAges: z.string().max(100).optional().or(z.literal('')),
  preferredContact: z.enum(['email', 'whatsapp', 'phone']),
  paymentPreference: z.enum(['card', 'bank_transfer', 'discuss']),
  specialRequests: z.string().max(1500).optional().or(z.literal('')),
  privacyConsent: z.literal(true),
  tours: z.array(z.string().min(1).max(120)).min(1).max(8),
}).refine(
  (data) => new Set(data.tours).size === data.tours.length,
  { message: 'A tour can only be added once.', path: ['tours'] },
).refine(
  (data) => data.adultsCount + data.childrenCount <= 30,
  { message: 'The group cannot exceed 30 travellers.', path: ['adultsCount'] },
).refine(
  (data) => {
    if (!data.startDate) return true;
    const date = new Date(`${data.startDate}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime())
      && date.toISOString().slice(0, 10) === data.startDate
      && data.startDate >= new Date().toISOString().slice(0, 10);
  },
  { message: 'Choose a future start date.', path: ['startDate'] },
);
