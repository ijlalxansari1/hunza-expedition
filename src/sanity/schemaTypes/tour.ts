import { defineField, defineType } from "sanity";

export const tourType = defineType({
  name: "tour",
  title: "Tour & Itinerary",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tour Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortSummary",
      title: "Short Summary",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(250),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Tour Overview",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Tour Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destinations",
      title: "Destinations Covered",
      type: "array",
      of: [{ type: "reference", to: [{ type: "destination" }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "durationDays",
      title: "Duration (Days)",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "difficulty",
      title: "Trip Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Gentle (Comfortable walks, scenic touring)", value: "Gentle" },
          { title: "Moderate (Some active walking, uneven terrain)", value: "Moderate" },
          { title: "Challenging (Long hikes, steeper ascents)", value: "Challenging" },
          { title: "Strenuous (High altitude trekking, remote trails)", value: "Strenuous" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "travelStyle",
      title: "Travel Style",
      type: "string",
      options: {
        list: [
          { title: "Cultural & Heritage", value: "Cultural & Heritage" },
          { title: "Scenic Road Journey", value: "Scenic Road Journey" },
          { title: "Active Walking & Valley Discovery", value: "Active Walking & Valley Discovery" },
          { title: "Family & Multi-Generational", value: "Family & Multi-Generational" },
        ],
      },
    }),
    defineField({
      name: "season",
      title: "Best Season / Operating Window",
      type: "string",
      description: "e.g., April to October, or Spring Blossom (Apr) & Autumn (Oct)",
    }),
    defineField({
      name: "price",
      title: "Estimated Starting Price",
      type: "number",
      description: "Enter only when a verified calculation exists. Otherwise leave blank.",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: ["USD", "EUR", "GBP", "PKR"],
      },
      initialValue: "USD",
    }),
    defineField({
      name: "pricingBasis",
      title: "Pricing Basis",
      type: "string",
      description: "e.g. 'Per person based on 2 travellers (Twin Sharing)'. Clearly state basis.",
    }),
    defineField({
      name: "isPriceConfirmed",
      title: "Is Price Operationally Confirmed?",
      type: "boolean",
      description: "Check only if this is a confirmed quotation. If false, UI indicates 'Enquire for seasonal quotation'.",
      initialValue: false,
    }),
    defineField({
      name: "itinerary",
      title: "Day-by-Day Itinerary",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "dayNumber", title: "Day Number", type: "number" },
            { name: "title", title: "Day Title", type: "string" },
            { name: "description", title: "Detailed Plan", type: "text", rows: 3 },
            { name: "accommodation", title: "Accommodation Details", type: "string" },
            { name: "mealsIncluded", title: "Meals Included", type: "string" },
            { name: "travelNotes", title: "Travel / Driving Notes", type: "string" },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "inclusions",
      title: "What's Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "exclusions",
      title: "What's Excluded",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "packingRequirements",
      title: "Things to Bring & Gear",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "safetyNotes",
      title: "Relevant Safety & High-Altitude Information",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publicationStatus",
      title: "Publication Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Review", value: "review" },
          { title: "Approved", value: "approved" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
  ],
});
