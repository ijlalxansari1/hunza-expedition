import { getPayload } from 'payload';
import configPromise from '../payload.config.ts';
import { initialDestinations } from '../src/data/seedDestinations.ts';
import { initialTours } from '../src/data/seedTours.ts';
import { initialPlaces, proposedPlaceSeeds } from '../src/data/seedPlaces.ts';
import { initialPlaceCategories } from '../src/data/seedPlaceCategories.ts';
import { initialExperiences } from '../src/data/seedExperiences.ts';
import { initialArticles } from '../src/data/seedArticles.ts';
import { initialFAQs } from '../src/data/seedFAQs.ts';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || args.length > 1) {
  throw new Error('Use either --dry-run or --apply.');
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined;

try {
  payload = await getPayload({ config: configPromise });
  let importedDestinations = 0;
  let skippedDestinations = 0;
  let importedTours = 0;
  let skippedTours = 0;
  let importedPlaces = 0;
  let skippedPlaces = 0;
  let importedPlaceCategories = 0;
  let skippedPlaceCategories = 0;
  let importedExperiences = 0;
  let skippedExperiences = 0;
  let importedArticles = 0;
  let skippedArticles = 0;
  let importedFAQs = 0;
  let skippedFAQs = 0;

  const placeCategoryIds = new Map<string, number>();
  for (const category of initialPlaceCategories) {
    const existing = await payload.find({
      collection: 'place-categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs[0]) {
      placeCategoryIds.set(category.slug, existing.docs[0].id);
      skippedPlaceCategories += 1;
      continue;
    }

    const parentCategory = category.parentCategorySlug
      ? placeCategoryIds.get(category.parentCategorySlug)
      : undefined;
    if (category.parentCategorySlug && !parentCategory) {
      throw new Error(`Parent category "${category.parentCategorySlug}" must be seeded before "${category.slug}".`);
    }
    if (apply) {
      const { parentCategorySlug, ...data } = category;
      void parentCategorySlug;
      const created = await payload.create({
        collection: 'place-categories',
        data: { ...data, parentCategory },
        overrideAccess: true,
      });
      placeCategoryIds.set(category.slug, created.id);
    } else {
      placeCategoryIds.set(category.slug, -(placeCategoryIds.size + 1));
    }
    importedPlaceCategories += 1;
  }

  for (const destination of initialDestinations) {
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: destination.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      skippedDestinations += 1;
      continue;
    }
    if (apply) {
      const { _id, ...data } = destination;
      void _id;
      await payload.create({
        collection: 'destinations',
        data: {
          ...data,
          coordinates: destination.coordinates
            ? { lat: destination.coordinates.lat, lng: destination.coordinates.lng }
            : undefined,
          bestTimeToVisit: destination.bestTimeToVisit
            ? {
              summary: destination.bestTimeToVisit.summary,
              seasons: destination.bestTimeToVisit.seasons.map((season) => ({
                season: season.season,
                months: season.months,
                description: season.description,
              })),
            }
            : undefined,
        },
        overrideAccess: true,
      });
    }
    importedDestinations += 1;
  }

  for (const tour of initialTours) {
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: tour.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      skippedTours += 1;
      continue;
    }
    if (apply) {
      const { _id, ...data } = tour;
      void _id;
      await payload.create({
        collection: 'tours',
        data,
        overrideAccess: true,
      });
    }
    importedTours += 1;
  }

  for (const place of [...initialPlaces, ...proposedPlaceSeeds]) {
    const existing = await payload.find({
      collection: 'places',
      where: { slug: { equals: place.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      const currentPrimaryCategory = existing.docs[0].primaryCategory;
      if (apply && !currentPrimaryCategory && place.primaryCategorySlug) {
        const primaryCategory = placeCategoryIds.get(place.primaryCategorySlug);
        const additionalCategories = (place.additionalCategorySlugs ?? [])
          .map((slug) => placeCategoryIds.get(slug))
          .filter((id): id is number => typeof id === 'number');
        if (!primaryCategory) {
          throw new Error(`Primary category "${place.primaryCategorySlug}" was not found for "${place.slug}".`);
        }
        await payload.update({
          collection: 'places',
          id: existing.docs[0].id,
          data: { primaryCategory, additionalCategories },
          overrideAccess: true,
        });
      }
      skippedPlaces += 1;
      continue;
    }
    if (apply) {
      const {
        primaryCategorySlug,
        additionalCategorySlugs,
        ...placeData
      } = place;
      const primaryCategory = placeCategoryIds.get(primaryCategorySlug);
      const additionalCategories = (additionalCategorySlugs ?? [])
        .map((slug) => placeCategoryIds.get(slug))
        .filter((id): id is number => typeof id === 'number');
      if (!primaryCategory) {
        throw new Error(`Primary category "${primaryCategorySlug}" was not found for "${place.slug}".`);
      }
      await payload.create({
        collection: 'places',
        data: { ...placeData, primaryCategory, additionalCategories },
        overrideAccess: true,
      });
    }
    importedPlaces += 1;
  }

  for (const experience of initialExperiences) {
    const existing = await payload.find({
      collection: 'experiences',
      where: { slug: { equals: experience.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      skippedExperiences += 1;
      continue;
    }
    if (apply) {
      await payload.create({
        collection: 'experiences',
        data: experience,
        overrideAccess: true,
      });
    }
    importedExperiences += 1;
  }

  for (const article of initialArticles) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: article.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      skippedArticles += 1;
      continue;
    }
    if (apply) {
      await payload.create({
        collection: 'articles',
        data: {
          ...article,
          contentType: article.contentType,
          imageAlt: article.title,
          richContent: undefined,
          tags: article.tags.map((tag) => ({ tag })),
        },
        overrideAccess: true,
      });
    }
    importedArticles += 1;
  }

  for (const faq of initialFAQs) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      skippedFAQs += 1;
      continue;
    }
    if (apply) {
      await payload.create({
        collection: 'faqs',
        data: faq,
        overrideAccess: true,
      });
    }
    importedFAQs += 1;
  }

  console.log(
    `${apply ? 'Imported' : 'Would import'} ${importedDestinations} destination(s), ${importedPlaceCategories} place category(ies), ${importedPlaces} place(s), ${importedTours} tour(s), ${importedExperiences} experience(s), ${importedArticles} guide(s), and ${importedFAQs} FAQ(s); skipped ${skippedDestinations + skippedPlaceCategories + skippedPlaces + skippedTours + skippedExperiences + skippedArticles + skippedFAQs} existing record(s).`,
  );
  if (!apply) {
    console.log('No records were changed. Re-run with --apply after reviewing the target database.');
  }
} catch (error) {
  console.error(
    error instanceof Error
      ? `Content import failed: ${error.message}`
      : 'Content import failed with an unknown error.',
  );
  process.exitCode = 1;
} finally {
  if (payload) {
    await payload.destroy();
    process.exit(process.exitCode ?? 0);
  }
}
