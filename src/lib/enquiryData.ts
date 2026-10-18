import { z } from 'zod';
import { enquirySchema } from './validations/enquiry.ts';

export const enquiryStatuses = [
  'new',
  'under_review',
  'preparing_quotation',
  'quotation_sent',
  'confirmed_manual',
  'closed',
  'not_feasible',
] as const;

export const storedEnquirySchema = enquirySchema.extend({
  referenceId: z.string().min(1),
  submittedAt: z.string().datetime(),
  status: z.enum(enquiryStatuses),
  internalNotes: z.string(),
});

export type StoredEnquiry = z.infer<typeof storedEnquirySchema>;

export function toPayloadEnquiryData(enquiry: StoredEnquiry) {
  const {
    website_field,
    ...data
  } = enquiry;
  void website_field;
  return data;
}
