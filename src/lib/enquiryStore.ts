import 'server-only';
import { getPayload } from 'payload';
import configPromise from '@/../payload.config';
import type { EnquiryFormData } from './validations/enquiry';
import { toPayloadEnquiryData, type StoredEnquiry } from './enquiryData';

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HX-${year}-${randomSuffix}`;
}

export async function saveEnquiry(
  formData: EnquiryFormData,
  sourceDescription = 'Received via Online Custom Journey Builder.',
): Promise<{ success: boolean; referenceId: string }> {
  const referenceId = generateReferenceId();
  const enquiry: StoredEnquiry = {
    ...formData,
    referenceId,
    submittedAt: new Date().toISOString(),
    status: "new",
    internalNotes: sourceDescription,
  };

  const payload = await getPayload({ config: configPromise });
  await payload.create({
    collection: 'enquiries',
    data: toPayloadEnquiryData(enquiry),
    overrideAccess: true,
  });

  return { success: true, referenceId };
}
