import { z } from 'zod';

export const adminEnquirySchema = z.object({
  referenceId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  submittedAt: z.string().datetime(),
  status: z.enum([
    'new',
    'under_review',
    'preparing_quotation',
    'quotation_sent',
    'confirmed_manual',
    'closed',
    'not_feasible',
  ]),
  selectedDestinations: z.array(z.string()),
});

export const adminEnquiryListSchema = z.array(adminEnquirySchema);
export type RecentEnquiry = z.infer<typeof adminEnquirySchema>;

export type EnquiryOverview =
  | {
      state: 'available';
      total: number;
      newCount: number;
      inProgressCount: number;
      recent: RecentEnquiry[];
    }
  | { state: 'unavailable' };

const activeStatuses = new Set(['under_review', 'preparing_quotation', 'quotation_sent']);

export function summarizeEnquiries(
  enquiries: RecentEnquiry[],
  counts: { total: number; newCount: number; inProgressCount: number } = {
    total: enquiries.length,
    newCount: enquiries.filter((enquiry) => enquiry.status === 'new').length,
    inProgressCount: enquiries.filter((enquiry) => activeStatuses.has(enquiry.status)).length,
  },
): EnquiryOverview {
  return {
    state: 'available',
    ...counts,
    recent: enquiries.slice(0, 10),
  };
}