// src/hooks/enquiryAfterChange.ts
import type { CollectionAfterChangeHook } from 'payload';

export const afterChangeHook: CollectionAfterChangeHook = async ({ operation, req, doc }) => {
  if (operation !== 'create' || req.context.skipEnquiryOutbox === true) {
    return doc;
  }

  await req.payload.create({
    req,
    collection: 'outbox',
    data: {
      enquiryId: doc.id,
      emailPayload: {
        to: doc.email,
        subject: `New journey enquiry: ${doc.referenceId}`,
        body: [
          `Reference: ${doc.referenceId}`,
          `Name: ${doc.fullName}`,
          `Email: ${doc.email}`,
          `Destinations: ${Array.isArray(doc.selectedDestinations) ? doc.selectedDestinations.join(', ') : ''}`,
          doc.specialRequests,
        ].filter(Boolean).join('\n'),
      },
    },
  });
  return doc;
};
