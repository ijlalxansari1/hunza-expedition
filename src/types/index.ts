export type PublicationStatus = "draft" | "review" | "approved" | "published";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceOfInterest {
  _id?: string;
  name: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  locationNote?: string;
  verifiedHeritageStatus?: string; // e.g. "UNESCO Tentative List" or null
}

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  region: string; // e.g., "Hunza Valley", "Nagar", "Skardu", "Gilgit"
  parentDestination?: string;
  shortDescription: string;
  overview: string;
  heroImageUrl: string;
  galleryUrls?: string[];
  coordinates?: Coordinates;
  placesOfInterest?: PlaceOfInterest[];
  bestTimeToVisit?: {
    summary: string;
    seasons: {
      season: string; // e.g. "Spring Blossom", "Summer High Season", "Autumn Gold", "Winter Quiet"
      months: string;
      description: string;
    }[];
  };
  transportNotes?: string;
  practicalInfo?: string[];
  safetyNotes?: string;
  publicationStatus: PublicationStatus;
  seoTitle?: string;
  metaDescription?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  mealsIncluded?: string;
  travelNotes?: string;
}

export interface Tour {
  _id: string;
  title: string;
  slug: string;
  shortSummary: string;
  fullDescription: string;
  heroImageUrl: string;
  galleryUrls?: string[];
  destinations: {
    _id: string;
    name: string;
    slug: string;
  }[];
  durationDays: number;
  difficulty: "Gentle" | "Moderate" | "Challenging" | "Strenuous";
  activityCategories: string[];
  travelStyle: string; // "Cultural & Heritage", "Scenic Road Trip", "Active Walking & Trekking"
  season: string;
  itinerary: ItineraryDay[];
  price?: number;
  currency?: string;
  pricingBasis?: string; // e.g. "Per person (twin sharing, min 2 travellers)"
  isPriceConfirmed: boolean;
  inclusions: string[];
  exclusions: string[];
  packingRequirements?: string[];
  safetyNotes?: string;
  publicationStatus: PublicationStatus;
  seoTitle?: string;
  metaDescription?: string;
}

export interface Activity {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  suitableTravellers?: string;
  requirements?: string;
  publicationStatus: PublicationStatus;
}

export interface LocalExperience {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  fullDescription: string;
  destinationSlug: string;
  destinationName: string;
  activityCategory: string;
  durationHours: string;
  seasonality: string;
  groupSizeLimit?: string;
  price?: number;
  pricingBasis?: string;
  inclusions: string[];
  requirements: string[];
  safetyNotes?: string;
  operationalApprovalStatus: "Proposed" | "In Review" | "Operationally Approved";
  publicationStatus: PublicationStatus;
}

export interface TravelGuideArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  relatedDestinations?: string[];
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: "planning" | "practical" | "seasons" | "tours" | "culture";
  displayOrder: number;
}

export interface EnquirySubmission {
  referenceId: string;
  submittedAt: string;
  // Step 1: Contact
  fullName: string;
  email: string;
  phone?: string;
  preferredContact: "email" | "whatsapp" | "phone";
  countryOfResidence?: string;
  // Step 2: Trip preferences
  startDate?: string;
  dateFlexibility: "exact" | "flexible_few_days" | "flexible_month";
  durationDays: number;
  adultsCount: number;
  childrenCount: number;
  childrenAges?: string;
  budgetPerPerson?: string;
  budgetCurrency: "USD" | "EUR" | "GBP" | "PKR";
  accommodationStyle: "standard_guesthouse" | "comfort_hotels" | "heritage_boutique" | "flexible";
  // Step 3: Destinations
  selectedDestinations: string[];
  // Step 4: Interests
  selectedInterests: string[];
  // Step 5: Notes
  specialRequests?: string;
  privacyConsent: boolean;
  status: "new" | "under_review" | "preparing_quotation" | "quotation_sent" | "confirmed_manual" | "closed" | "not_feasible";
}
