// src/hooks/enquiryAfterChange.ts
import type { CollectionAfterChangeHook } from 'payload';

export const afterChangeHook: CollectionAfterChangeHook = async ({ req, doc }) => {
  // Ensure the same request object is threaded to maintain transaction context.
  await req.payload.create({
    req,
    collection: 'outbox',
    data: {
      enquiryId: doc.id,
      emailPayload: {
        to: doc.email,
        subject: 'New enquiry received',
        body: doc.message,
      },
    },
  });
};
