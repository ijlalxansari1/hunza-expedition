import { groq } from "next-sanity";
import { Destination, Tour } from "@/types";
import { initialDestinations } from "../data/seedDestinations";
import { initialTours } from "../data/seedTours";
import { sanityFetch } from "./client";

export const destinationsQuery = groq`
  *[_type == "destination" && publicationStatus == "published"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    region,
    shortDescription,
    overview,
    "heroImageUrl": heroImage.asset->url,
    placesOfInterest,
    bestTimeToVisit,
    transportNotes,
    practicalInfo,
    safetyNotes,
    publicationStatus
  }
`;

export const destinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    region,
    shortDescription,
    overview,
    "heroImageUrl": heroImage.asset->url,
    placesOfInterest,
    bestTimeToVisit,
    transportNotes,
    practicalInfo,
    safetyNotes,
    publicationStatus,
    seoTitle,
    metaDescription
  }
`;

export async function getPublishedDestinations(): Promise<Destination[]> {
  return sanityFetch<Destination[]>({
    query: destinationsQuery,
    fallback: initialDestinations.filter((d) => d.publicationStatus === "published"),
  });
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const fallback = initialDestinations.find((d) => d.slug === slug) || null;
  return sanityFetch<Destination | null>({
    query: destinationBySlugQuery,
    params: { slug },
    fallback,
  });
}

// Tours

export const toursQuery = groq`
  *[_type == "tour" && publicationStatus == "published"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortSummary,
    fullDescription,
    "heroImageUrl": heroImage.asset->url,
    destinations[]->{
      _id,
      name,
      "slug": slug.current
    },
    durationDays,
    difficulty,
    activityCategories,
    travelStyle,
    season,
    price,
    currency,
    pricingBasis,
    isPriceConfirmed,
    inclusions,
    exclusions,
    packingRequirements,
    safetyNotes,
    publicationStatus
  }
`;

export const tourBySlugQuery = groq`
  *[_type == "tour" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortSummary,
    fullDescription,
    "heroImageUrl": heroImage.asset->url,
    destinations[]->{
      _id,
      name,
      "slug": slug.current
    },
    durationDays,
    difficulty,
    activityCategories,
    travelStyle,
    season,
    price,
    currency,
    pricingBasis,
    isPriceConfirmed,
    itinerary,
    inclusions,
    exclusions,
    packingRequirements,
    safetyNotes,
    publicationStatus,
    seoTitle,
    metaDescription
  }
`;

export async function getPublishedTours(): Promise<Tour[]> {
  return sanityFetch<Tour[]>({
    query: toursQuery,
    fallback: initialTours.filter((t) => t.publicationStatus === "published"),
  });
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const fallback = initialTours.find((t) => t.slug === slug) || null;
  return sanityFetch<Tour | null>({
    query: tourBySlugQuery,
    params: { slug },
    fallback,
  });
}

