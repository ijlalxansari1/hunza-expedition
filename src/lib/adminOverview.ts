import 'server-only';
import type { PayloadRequest } from 'payload';
import {
  adminEnquiryListSchema,
  summarizeEnquiries,
  type EnquiryOverview,
} from './adminOverviewSummary';

export type ContentOverview = {
  published: {
    destinations: number;
    places: number;
    tours: number;
    experiences: number;
    articles: number;
    faqs: number;
  };
  draftsAndReview: {
    places: number;
    tours: number;
    experiences: number;
    articles: number;
    total: number;
  };
};

export async function getEnquiryOverview(req: PayloadRequest): Promise<EnquiryOverview> {
  const collection = 'enquiries';
  const access = { req, overrideAccess: false, collection, depth: 0 } as const;
  const [all, newEnquiries, inProgressEnquiries, recent] = await Promise.all([
    req.payload.find({ ...access, limit: 1 }),
    req.payload.find({ ...access, where: { status: { equals: 'new' } }, limit: 1 }),
    req.payload.find({
      ...access,
      where: {
        status: {
          in: ['under_review', 'preparing_quotation', 'quotation_sent'],
        },
      },
      limit: 1,
    }),
    req.payload.find({ ...access, sort: '-submittedAt', limit: 10 }),
  ]);

  const enquiries = adminEnquiryListSchema.parse(recent.docs.map((enquiry) => ({
    referenceId: enquiry.referenceId,
    fullName: enquiry.fullName,
    email: enquiry.email,
    submittedAt: enquiry.submittedAt,
    status: enquiry.status,
    selectedDestinations: enquiry.selectedDestinations,
  })));

  return summarizeEnquiries(enquiries, {
    total: all.totalDocs,
    newCount: newEnquiries.totalDocs,
    inProgressCount: inProgressEnquiries.totalDocs,
  });
}

export async function getContentOverview(req: PayloadRequest): Promise<ContentOverview> {
  const [
    destinations,
    places,
    tours,
    experiences,
    articles,
    faqs,
    placesPending,
    toursPending,
    experiencesPending,
    articlesPending,
  ] = await Promise.all([
    req.payload.find({
      collection: 'destinations',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'places',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'tours',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'experiences',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'articles',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'faqs',
      where: { publicationStatus: { equals: 'published' } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'places',
      where: { publicationStatus: { in: ['draft', 'review'] } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'tours',
      where: { publicationStatus: { in: ['draft', 'review'] } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'experiences',
      where: { publicationStatus: { in: ['draft', 'review'] } },
      limit: 1,
      depth: 0,
    }),
    req.payload.find({
      collection: 'articles',
      where: { publicationStatus: { in: ['draft', 'review'] } },
      limit: 1,
      depth: 0,
    }),
  ]);

  const draftsTotal = placesPending.totalDocs + toursPending.totalDocs + experiencesPending.totalDocs + articlesPending.totalDocs;

  return {
    published: {
      destinations: destinations.totalDocs,
      places: places.totalDocs,
      tours: tours.totalDocs,
      experiences: experiences.totalDocs,
      articles: articles.totalDocs,
      faqs: faqs.totalDocs,
    },
    draftsAndReview: {
      places: placesPending.totalDocs,
      tours: toursPending.totalDocs,
      experiences: experiencesPending.totalDocs,
      articles: articlesPending.totalDocs,
      total: draftsTotal,
    },
  };
}