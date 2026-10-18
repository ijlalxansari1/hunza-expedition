import 'server-only';
import { z } from 'zod';
import { getPayload, type Where } from 'payload';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import configPromise from '@/../payload.config';
import { initialArticles } from '@/data/seedArticles';
import { initialExperiences } from '@/data/seedExperiences';
import { initialFAQs } from '@/data/seedFAQs';
import { initialPlaces, proposedPlaceSeeds } from '@/data/seedPlaces';
import { initialPlaceCategories } from '@/data/seedPlaceCategories';
import { withDatabaseFallback } from '@/lib/databaseFallback';
import { cachePublicContent } from '@/lib/publicContentCache';
import { optimizedImageUrl } from '@/lib/imageUrl';

const publicationStatusSchema = z.enum(['draft', 'review', 'approved', 'published']);

const placeSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  destinationSlug: z.string(),
  destinationName: z.string(),
  geographicArea: z.string().optional(),
  region: z.string(),
  shortDescription: z.string(),
  description: z.string().nullable().optional(),
  heroImageUrl: z.string().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  gallery: z.array(z.object({
    imageUrl: z.string(),
    imageAlt: z.string(),
    caption: z.string().nullable().optional(),
  })).nullable().optional(),
  locationNote: z.string().nullable().optional(),
  primaryCategory: z.union([
    z.number(),
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      iconName: z.string().nullable().optional(),
      markerColor: z.string().nullable().optional(),
      isActive: z.boolean().optional(),
      publicationStatus: publicationStatusSchema.optional(),
    }).passthrough(),
  ]).nullable().optional(),
  additionalCategories: z.array(z.union([
    z.number(),
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      iconName: z.string().nullable().optional(),
      markerColor: z.string().nullable().optional(),
      isActive: z.boolean().optional(),
      publicationStatus: publicationStatusSchema.optional(),
    }).passthrough(),
  ])).nullable().optional(),
  travelTypes: z.array(z.union([z.string(), z.object({ travelType: z.string() }).passthrough()]))
    .nullable().optional().transform((items) => items?.map((item) => (
      typeof item === 'string' ? item : item.travelType
    )) ?? []),
  officialDesignations: z.array(z.union([
    z.number(),
    z.object({
      id: z.number(),
      officialName: z.string(),
      designationType: z.enum([
        'unesco_world_heritage',
        'unesco_tentative_list',
        'unesco_intangible_heritage',
        'unesco_global_geopark',
        'unesco_biosphere_reserve',
        'unesco_other',
        'national_protected_area',
        'other_official',
      ]),
      designationStatus: z.enum(['inscribed', 'tentative_list', 'recognized_element', 'designated', 'proposed']),
      geographicArea: z.string(),
      countryOrArea: z.string(),
      officialSourceUrl: z.string(),
      verificationStatus: z.enum(['pending', 'verified', 'not_verified', 'rejected']),
      lastVerifiedAt: z.string().nullable().optional(),
      publicationStatus: publicationStatusSchema,
    }).passthrough(),
  ])).nullable().optional(),
  relatedExperiences: z.array(z.union([
    z.number(),
    z.object({ id: z.number(), title: z.string(), slug: z.string() }).passthrough(),
  ])).nullable().optional(),
  relatedTours: z.array(z.union([
    z.number(),
    z.object({ id: z.number(), title: z.string(), slug: z.string() }).passthrough(),
  ])).nullable().optional(),
  relatedArticles: z.array(z.union([
    z.number(),
    z.object({ id: z.number(), title: z.string(), slug: z.string(), contentType: z.enum(['guide', 'blog']).optional() }).passthrough(),
  ])).nullable().optional(),
  sourceLinks: z.array(z.object({
    title: z.string(),
    url: z.string(),
    verificationStatus: z.enum(['pending', 'verified', 'not_verified']),
    lastVerifiedAt: z.string().nullable().optional(),
  })).nullable().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).nullable().optional(),
  showOnMap: z.boolean().optional(),
  mapMarkerLabel: z.string().nullable().optional(),
  publicationStatus: publicationStatusSchema,
  seoTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

const placeCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  parentCategory: z.union([
    z.number(),
    z.object({ id: z.number(), name: z.string(), slug: z.string() }).passthrough(),
  ]).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  iconName: z.string().nullable().optional(),
  markerColor: z.string().nullable().optional(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  publicationStatus: publicationStatusSchema,
  seoTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

const experienceSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  location: z.string(),
  category: z.string(),
  duration: z.string(),
  season: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  operationalStatus: z.enum(['Proposed', 'In Review', 'Operationally Approved']),
  publicationStatus: publicationStatusSchema,
  seoTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

const lexicalStateSchema = z.custom<SerializedEditorState>((value) => (
  typeof value === 'object'
  && value !== null
  && 'root' in value
  && typeof value.root === 'object'
  && value.root !== null
  && 'children' in value.root
  && Array.isArray(value.root.children)
));

const articleAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  biography: z.string(),
  imageUrl: z.string().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
}).passthrough();

const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  contentType: z.enum(['guide', 'blog']).default('guide'),
  category: z.string(),
  excerpt: z.string(),
  content: z.string().nullable().optional(),
  richContent: lexicalStateSchema.nullable().optional(),
  imageUrl: z.string(),
  imageAlt: z.string().nullable().optional(),
  imageCaption: z.string().nullable().optional(),
  readTimeMinutes: z.number(),
  author: z.string().nullable().optional(),
  authorProfile: z.union([z.number(), articleAuthorSchema]).nullable().optional(),
  tags: z.array(z.union([
    z.string(),
    z.object({ tag: z.string() }).passthrough(),
  ])).nullable().optional().transform((tags) => tags?.map((tag) => (
    typeof tag === 'string' ? tag : tag.tag
  )) ?? []),
  publishedAt: z.string().nullable().optional(),
  relatedDestinations: z.array(z.string()).nullable().optional(),
  relatedTours: z.array(z.string()).nullable().optional(),
  relatedPlaces: z.array(z.string()).nullable().optional(),
  relatedExperiences: z.array(z.string()).nullable().optional(),
  relatedArticles: z.array(z.string()).nullable().optional(),
  publicationStatus: publicationStatusSchema,
  seoTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

const faqSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  category: z.enum(['planning', 'practical', 'seasons', 'tours', 'culture']),
  displayOrder: z.number(),
  publicationStatus: publicationStatusSchema,
});

export type PlaceContent = z.infer<typeof placeSchema>;
export type PlaceCategoryContent = z.infer<typeof placeCategorySchema>;
export type ExperienceContent = z.infer<typeof experienceSchema>;
export type ArticleContent = z.infer<typeof articleSchema>;
export type FAQContent = z.infer<typeof faqSchema>;

function mapPlace(doc: unknown): PlaceContent {
  const place = placeSchema.parse(doc);
  return {
    ...place,
    heroImageUrl: place.heroImageUrl ? optimizedImageUrl(place.heroImageUrl) : place.heroImageUrl,
    gallery: place.gallery?.map((image) => ({
      ...image,
      imageUrl: optimizedImageUrl(image.imageUrl),
    })),
    primaryCategory: place.primaryCategory && typeof place.primaryCategory !== 'number'
      && (!('isActive' in place.primaryCategory) || place.primaryCategory.isActive)
      && (!('publicationStatus' in place.primaryCategory) || place.primaryCategory.publicationStatus === 'published')
      ? place.primaryCategory
      : null,
    additionalCategories: place.additionalCategories?.filter((category) => (
      typeof category !== 'number'
      && (!('isActive' in category) || category.isActive)
      && (!('publicationStatus' in category) || category.publicationStatus === 'published')
    )),
    officialDesignations: place.officialDesignations?.filter((designation) => (
      typeof designation !== 'number'
      && designation.verificationStatus === 'verified'
      && designation.publicationStatus === 'published'
      && Boolean(designation.lastVerifiedAt)
      && isValidPublishedDesignation(designation)
    )),
    sourceLinks: place.sourceLinks?.filter((source) => (
      source.verificationStatus === 'verified'
      && Boolean(source.lastVerifiedAt)
      && isHttpUrl(source.url)
    )),
  };
}

function mapPlaces(docs: unknown[]): PlaceContent[] {
  return docs.map(mapPlace);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidPublishedDesignation(
  designation: Exclude<NonNullable<PlaceContent['officialDesignations']>[number], number>,
): boolean {
  try {
    const source = new URL(designation.officialSourceUrl);
    if (source.protocol !== 'https:') return false;
    switch (designation.designationType) {
      case 'unesco_world_heritage':
        return source.hostname === 'unesco.org'
          || source.hostname.endsWith('.unesco.org')
          ? designation.designationStatus === 'inscribed'
          : false;
      case 'unesco_tentative_list':
        return (source.hostname === 'unesco.org' || source.hostname.endsWith('.unesco.org'))
          && designation.designationStatus === 'tentative_list';
      case 'unesco_intangible_heritage':
        return (source.hostname === 'unesco.org' || source.hostname.endsWith('.unesco.org'))
          && designation.designationStatus === 'recognized_element';
      case 'unesco_global_geopark':
      case 'unesco_biosphere_reserve':
        return (source.hostname === 'unesco.org' || source.hostname.endsWith('.unesco.org'))
          && designation.designationStatus === 'designated';
      case 'unesco_other':
        return (source.hostname === 'unesco.org' || source.hostname.endsWith('.unesco.org'))
          && ['inscribed', 'tentative_list', 'recognized_element', 'designated'].includes(designation.designationStatus);
      case 'national_protected_area':
      case 'other_official':
        return designation.designationStatus === 'designated' || designation.designationStatus === 'inscribed';
    }
  } catch {
    return false;
  }
}

function mapPlaceCategory(doc: unknown): PlaceCategoryContent {
  const category = placeCategorySchema.parse(doc);
  return {
    ...category,
    imageUrl: category.imageUrl ? optimizedImageUrl(category.imageUrl) : category.imageUrl,
  };
}

function mapExperiences(docs: unknown[]): ExperienceContent[] {
  return docs.map((doc) => {
    const experience = experienceSchema.parse(doc);
    return { ...experience, imageUrl: optimizedImageUrl(experience.imageUrl) };
  });
}

function mapArticles(docs: unknown[]): ArticleContent[] {
  return docs.map((doc) => {
    const article = articleSchema.parse(doc);
    return {
      ...article,
      imageUrl: optimizedImageUrl(article.imageUrl),
      authorProfile: article.authorProfile && typeof article.authorProfile !== 'number'
        ? {
          ...article.authorProfile,
          imageUrl: article.authorProfile.imageUrl
            ? optimizedImageUrl(article.authorProfile.imageUrl)
            : article.authorProfile.imageUrl,
        }
        : article.authorProfile,
    };
  });
}

function mapFAQs(docs: unknown[]): FAQContent[] {
  return docs.map((doc) => faqSchema.parse(doc));
}

async function hasEditorialRecords(
  collection: 'places' | 'experiences' | 'articles' | 'faqs',
): Promise<boolean> {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs.length > 0;
}

async function readPublishedPlaces(destinationSlug?: string): Promise<PlaceContent[]> {
  return withDatabaseFallback('Published places', async () => {
    const payload = await getPayload({ config: configPromise });
    const where: Where = destinationSlug
      ? {
        and: [
          { publicationStatus: { equals: 'published' as const } },
          { destinationSlug: { equals: destinationSlug } },
        ],
      }
      : { publicationStatus: { equals: 'published' as const } };
    const result = await payload.find({
      collection: 'places',
      where,
      sort: 'name',
      pagination: false,
      depth: 2,
    });

    if (result.docs.length > 0) {
      return mapPlaces(result.docs);
    }
    if (await hasEditorialRecords('places')) {
      return [];
    }
    return initialPlaces.filter((place) => (
      place.publicationStatus === 'published'
      && (!destinationSlug || place.destinationSlug === destinationSlug)
    )).map(seedPlaceToContent);
  }, () => initialPlaces.filter((place) => (
    place.publicationStatus === 'published'
    && (!destinationSlug || place.destinationSlug === destinationSlug)
  )).map(seedPlaceToContent));
}

export const getPublishedPlaces = cachePublicContent(
  'places-list',
  readPublishedPlaces,
);

async function readPlaceBySlug(slug: string, includeDraft: boolean): Promise<PlaceContent | null> {
  return withDatabaseFallback('Place detail', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'places',
      where: includeDraft
        ? { slug: { equals: slug } }
        : {
          and: [
            { slug: { equals: slug } },
            { publicationStatus: { equals: 'published' } },
          ],
        },
      limit: 1,
      depth: 2,
      overrideAccess: includeDraft,
    });
    if (result.docs[0]) {
      return mapPlace(result.docs[0]);
    }
    if (includeDraft) return null;
    const existing = await payload.find({
      collection: 'places',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length > 0 || await hasEditorialRecords('places')) {
      return null;
    }
    const fallback = [...initialPlaces, ...proposedPlaceSeeds].find((place) => (
      place.slug === slug && place.publicationStatus === 'published'
    ));
    return fallback ? seedPlaceToContent(fallback, 0) : null;
  }, () => {
    const fallback = [...initialPlaces, ...proposedPlaceSeeds].find((place) => (
      place.slug === slug && place.publicationStatus === 'published'
    ));
    return fallback ? seedPlaceToContent(fallback, 0) : null;
  });
}

const getCachedPublishedPlaceBySlug = cachePublicContent(
  'place-detail',
  (slug: string) => readPlaceBySlug(slug, false),
);

export function getPlaceBySlug(slug: string, includeDraft = false): Promise<PlaceContent | null> {
  return includeDraft
    ? readPlaceBySlug(slug, true)
    : getCachedPublishedPlaceBySlug(slug);
}

function fallbackPlaceCategories(): PlaceCategoryContent[] {
  const idsBySlug = new Map(initialPlaceCategories.map((category, index) => [category.slug, index + 1]));
  return initialPlaceCategories.map((category, index) => placeCategorySchema.parse({
    ...category,
    id: index + 1,
    parentCategory: category.parentCategorySlug
      ? idsBySlug.get(category.parentCategorySlug)
      : undefined,
  }));
}

function seedPlaceToContent(
  place: (typeof initialPlaces)[number] | (typeof proposedPlaceSeeds)[number],
  index: number,
): PlaceContent {
  const categoryContent = (slug: string) => {
    const category = initialPlaceCategories.find((item) => item.slug === slug);
    const categoryId = initialPlaceCategories.findIndex((item) => item.slug === slug) + 1;
    return category ? {
      id: categoryId,
      name: category.name,
      slug: category.slug,
      iconName: category.iconName,
      markerColor: category.markerColor,
    } : undefined;
  };

  return placeSchema.parse({
    ...place,
    id: index + 1,
    primaryCategory: categoryContent(place.primaryCategorySlug),
    additionalCategories: (place.additionalCategorySlugs ?? [])
      .map(categoryContent)
      .filter((category) => category !== undefined),
  });
}

async function readPublishedPlaceCategories(): Promise<PlaceCategoryContent[]> {
  return withDatabaseFallback('Published place categories', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'place-categories',
      where: {
        and: [
          { publicationStatus: { equals: 'published' } },
          { isActive: { equals: true } },
        ],
      },
      sort: 'displayOrder',
      pagination: false,
      depth: 1,
    });
    if (result.docs.length > 0) return result.docs.map(mapPlaceCategory);
    const hasRecords = await payload.find({
      collection: 'place-categories',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return hasRecords.docs.length > 0
      ? []
      : fallbackPlaceCategories().filter((category) => category.isActive && category.publicationStatus === 'published');
  }, () => fallbackPlaceCategories().filter((category) => category.isActive && category.publicationStatus === 'published'));
}

export const getPublishedPlaceCategories = cachePublicContent(
  'place-categories-list',
  readPublishedPlaceCategories,
);

async function readPlaceCategoryBySlug(
  slug: string,
  includeDraft: boolean,
): Promise<PlaceCategoryContent | null> {
  return withDatabaseFallback('Place category page', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'place-categories',
      where: includeDraft
        ? { slug: { equals: slug } }
        : {
          and: [
            { slug: { equals: slug } },
            { publicationStatus: { equals: 'published' } },
            { isActive: { equals: true } },
          ],
        },
      limit: 1,
      depth: 1,
      overrideAccess: includeDraft,
    });
    if (result.docs[0]) return mapPlaceCategory(result.docs[0]);
    return null;
  }, () => fallbackPlaceCategories().find((category) => (
    category.slug === slug && category.isActive && category.publicationStatus === 'published'
  )) ?? null);
}

const getCachedPublishedPlaceCategoryBySlug = cachePublicContent(
  'place-category-detail',
  (slug: string) => readPlaceCategoryBySlug(slug, false),
);

export function getPublishedPlaceCategoryBySlug(
  slug: string,
  includeDraft = false,
): Promise<PlaceCategoryContent | null> {
  return includeDraft
    ? readPlaceCategoryBySlug(slug, true)
    : getCachedPublishedPlaceCategoryBySlug(slug);
}

async function readPlacesInCategory(
  categoryId: number,
  categorySlug: string,
  includeDraft: boolean,
): Promise<PlaceContent[]> {
  return withDatabaseFallback('Places in category', async () => {
    const payload = await getPayload({ config: configPromise });
    const categoryFilter: Where = {
      or: [
        { primaryCategory: { equals: categoryId } },
        { additionalCategories: { contains: categoryId } },
      ],
    };
    const result = await payload.find({
      collection: 'places',
      where: includeDraft
        ? categoryFilter
        : { and: [{ publicationStatus: { equals: 'published' } }, categoryFilter] },
      sort: 'name',
      pagination: false,
      depth: 2,
      overrideAccess: includeDraft,
    });
    return mapPlaces(result.docs);
  }, () => [...initialPlaces, ...proposedPlaceSeeds]
    .filter((place) => (
      place.publicationStatus === 'published'
      && (
        place.primaryCategorySlug === categorySlug
        || place.additionalCategorySlugs?.includes(categorySlug)
      )
    ))
    .map(seedPlaceToContent));
}

const getCachedPublishedPlacesInCategory = cachePublicContent(
  'places-by-category',
  (categoryId: number, categorySlug: string) => readPlacesInCategory(categoryId, categorySlug, false),
);

export function getPublishedPlacesInCategory(
  category: PlaceCategoryContent,
  includeDraft = false,
): Promise<PlaceContent[]> {
  return includeDraft
    ? readPlacesInCategory(category.id, category.slug, true)
    : getCachedPublishedPlacesInCategory(category.id, category.slug);
}

async function readPublishedExperiences(): Promise<ExperienceContent[]> {
  return withDatabaseFallback('Published experiences', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'experiences',
      where: { publicationStatus: { equals: 'published' } },
      sort: 'title',
      pagination: false,
      depth: 0,
    });
    if (result.docs.length > 0) return mapExperiences(result.docs);
    if (await hasEditorialRecords('experiences')) return [];
    return initialExperiences.filter((item) => item.publicationStatus === 'published')
      .map((item, index) => experienceSchema.parse({ ...item, id: index + 1 }));
  }, () => initialExperiences.filter((item) => item.publicationStatus === 'published')
    .map((item, index) => experienceSchema.parse({ ...item, id: index + 1 })));
}

export const getPublishedExperiences = cachePublicContent(
  'experiences-list',
  readPublishedExperiences,
);

async function readPublishedArticles(contentType: 'guide' | 'blog' = 'guide'): Promise<ArticleContent[]> {
  return withDatabaseFallback('Published articles', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { publicationStatus: { equals: 'published' } },
          { contentType: { equals: contentType } },
        ],
      },
      sort: '-publishedAt',
      pagination: false,
      depth: 1,
    });
    if (result.docs.length > 0) return mapArticles(result.docs);
    if (await hasEditorialRecords('articles')) return [];
    return initialArticles.filter((item) => item.publicationStatus === 'published' && (item.contentType ?? 'guide') === contentType)
      .map((item, index) => articleSchema.parse({ ...item, id: index + 1 }));
  }, () => initialArticles.filter((item) => item.publicationStatus === 'published' && (item.contentType ?? 'guide') === contentType)
    .map((item, index) => articleSchema.parse({ ...item, id: index + 1 })));
}

export const getPublishedArticles = cachePublicContent(
  'articles-list',
  readPublishedArticles,
);

export interface ArticleListingOptions {
  contentType: 'guide' | 'blog';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ArticleListing {
  articles: ArticleContent[];
  categories: string[];
  page: number;
  totalPages: number;
  totalDocs: number;
}

async function readPublishedArticlePage(options: ArticleListingOptions): Promise<ArticleListing> {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const limit = Math.min(24, Math.max(1, Math.floor(options.limit ?? 9)));
  const search = options.search?.trim().slice(0, 100);
  const seedListing = (): ArticleListing => {
    let fallback = initialArticles.filter((item) => (
    item.publicationStatus === 'published' && (item.contentType ?? 'guide') === options.contentType
    ));
    if (options.category) fallback = fallback.filter((item) => item.category === options.category);
    if (search) {
      const term = search.toLocaleLowerCase();
      fallback = fallback.filter((item) => (
        `${item.title} ${item.excerpt} ${item.category}`.toLocaleLowerCase().includes(term)
      ));
    }
    const totalDocs = fallback.length;
    return {
      articles: fallback.slice((page - 1) * limit, page * limit)
        .map((item, index) => articleSchema.parse({ ...item, id: (page - 1) * limit + index + 1 })),
      categories: [...new Set(initialArticles
        .filter((item) => item.publicationStatus === 'published' && (item.contentType ?? 'guide') === options.contentType)
        .map((item) => item.category))],
      page,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocs,
    };
  };

  return withDatabaseFallback('Published article listing', async () => {
    const whereParts: Where[] = [
      { publicationStatus: { equals: 'published' } },
      { contentType: { equals: options.contentType } },
    ];
    if (options.category) whereParts.push({ category: { equals: options.category } });
    if (search) {
      whereParts.push({
        or: [
          { title: { like: search } },
          { excerpt: { like: search } },
          { category: { like: search } },
        ],
      });
    }

    const payload = await getPayload({ config: configPromise });
    const [result, categoryResult] = await Promise.all([
      payload.find({
        collection: 'articles',
        where: { and: whereParts },
        sort: '-publishedAt',
        page,
        limit,
        depth: 1,
      }),
      payload.find({
        collection: 'articles',
        where: {
          and: [
            { publicationStatus: { equals: 'published' } },
            { contentType: { equals: options.contentType } },
          ],
        },
        sort: 'category',
        pagination: false,
        depth: 0,
      }),
    ]);
    if (result.docs.length > 0 || await hasEditorialRecords('articles')) {
      return {
        articles: mapArticles(result.docs),
        categories: [...new Set(categoryResult.docs.map((article) => article.category).filter(Boolean))],
        page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
      };
    }
    return seedListing();
  }, seedListing);
}

export const getPublishedArticlePage = cachePublicContent(
  'articles-page',
  readPublishedArticlePage,
);

async function readArticleBySlug(
  slug: string,
  contentType: 'guide' | 'blog',
  includeDraft: boolean,
): Promise<ArticleContent | null> {
  return withDatabaseFallback('Article detail', async () => {
    const payload = await getPayload({ config: configPromise });
    const filters: Where[] = [
      { slug: { equals: slug } },
      { contentType: { equals: contentType } },
    ];
    if (!includeDraft) filters.push({ publicationStatus: { equals: 'published' } });
    const result = await payload.find({
      collection: 'articles',
      where: { and: filters },
      limit: 1,
      depth: 1,
      overrideAccess: includeDraft,
    });
    if (result.docs[0]) {
      return mapArticles([result.docs[0]])[0];
    }
    const existing = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { slug: { equals: slug } },
          { contentType: { equals: contentType } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length > 0 || await hasEditorialRecords('articles')) {
      return null;
    }
    const fallback = initialArticles.find((item) => (
      item.slug === slug
      && (item.contentType ?? 'guide') === contentType
      && item.publicationStatus === 'published'
    ));
    return fallback ? articleSchema.parse({ ...fallback, id: 1 }) : null;
  }, () => {
    const fallback = initialArticles.find((item) => (
      item.slug === slug
      && (item.contentType ?? 'guide') === contentType
      && item.publicationStatus === 'published'
    ));
    return fallback ? articleSchema.parse({ ...fallback, id: 1 }) : null;
  });
}

const getCachedPublishedArticleBySlug = cachePublicContent(
  'article-detail',
  (slug: string, contentType: 'guide' | 'blog') => readArticleBySlug(slug, contentType, false),
);

export function getArticleBySlug(
  slug: string,
  contentType: 'guide' | 'blog' = 'guide',
  includeDraft = false,
): Promise<ArticleContent | null> {
  return includeDraft
    ? readArticleBySlug(slug, contentType, true)
    : getCachedPublishedArticleBySlug(slug, contentType);
}

async function readPublishedFAQs(): Promise<FAQContent[]> {
  return withDatabaseFallback('Published FAQs', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'faqs',
      where: { publicationStatus: { equals: 'published' } },
      sort: 'displayOrder',
      pagination: false,
      depth: 0,
    });
    if (result.docs.length > 0) return mapFAQs(result.docs);
    if (await hasEditorialRecords('faqs')) return [];
    return initialFAQs.map((item, index) => faqSchema.parse({ ...item, id: index + 1 }));
  }, () => initialFAQs.map((item, index) => faqSchema.parse({ ...item, id: index + 1 })));
}

export const getPublishedFAQs = cachePublicContent(
  'faqs-list',
  readPublishedFAQs,
);
