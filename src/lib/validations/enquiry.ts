import { z } from "zod";

export const enquirySchema = z.object({
  // Anti-spam honeypot (must be empty)
  website_field: z.string().max(0, "Spam detected").optional(),

  // Step 1: Contact details
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  preferredContact: z.enum(["email", "whatsapp", "phone"]).default("email"),
  countryOfResidence: z.string().max(80).optional().or(z.literal("")),

  // Step 2: Trip preferences
  startDate: z.string().optional().or(z.literal("")),
  dateFlexibility: z.enum(["exact", "flexible_few_days", "flexible_month"]).default("flexible_few_days"),
  durationDays: z.coerce.number().min(1, "Minimum duration is 1 day").max(60, "Maximum duration is 60 days").default(7),
  adultsCount: z.coerce.number().min(1, "At least 1 adult required").max(30).default(2),
  childrenCount: z.coerce.number().min(0).max(20).default(0),
  childrenAges: z.string().max(100).optional().or(z.literal("")),
  budgetPerPerson: z.string().max(50).optional().or(z.literal("")),
  budgetCurrency: z.enum(["USD", "EUR", "GBP", "PKR"]).default("USD"),
  accommodationStyle: z.enum(["standard_guesthouse", "comfort_hotels", "heritage_boutique", "flexible"]).default("comfort_hotels"),

  // Step 3: Destinations
  selectedDestinations: z.array(z.string()).min(1, "Please select at least one destination"),

  // Step 4: Interests
  selectedInterests: z.array(z.string()).default([]),

  // Step 5: Notes & Consent
  specialRequests: z.string().max(2000).optional().or(z.literal("")),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy to submit an enquiry",
  }),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
