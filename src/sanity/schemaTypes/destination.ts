import { defineField, defineType } from "sanity";

export const destinationType = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Destination Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "e.g., Hunza, Nagar, Skardu, Gilgit, Ghizer, Astore",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parentDestination",
      title: "Parent Destination",
      type: "reference",
      to: [{ type: "destination" }],
      description: "Optional hierarchy if this is a sub-valley or village (e.g. Karimabad under Hunza Valley)",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Summary",
      type: "text",
      rows: 2,
      description: "Appears on listing cards and search snippets (max 200 chars)",
      validation: (rule) => rule.required().max(250),
    }),
    defineField({
      name: "overview",
      title: "Detailed Overview & Local Context",
      type: "text",
      rows: 6,
      description: "Comprehensive narrative about landscape, history, culture, and significance.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Descriptive alt text for accessibility and SEO.",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placesOfInterest",
      title: "Places of Interest & Attractions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Attraction Name", type: "string" },
            { name: "summary", title: "Brief Summary", type: "text", rows: 2 },
            { name: "description", title: "Full Description", type: "text", rows: 4 },
            { name: "imageUrl", title: "Image URL or Upload", type: "string" },
            { name: "verifiedHeritageStatus", title: "Verified Heritage / UNESCO Status", type: "string", description: "Accurate status only (e.g., 'UNESCO Tentative List' or null)" },
          ],
        },
      ],
    }),
    defineField({
      name: "bestTimeToVisit",
      title: "Best Time to Visit Guidance",
      type: "object",
      fields: [
        { name: "summary", title: "Summary", type: "string" },
        {
          name: "seasons",
          title: "Seasonal Breakdown",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "season", title: "Season Name", type: "string" },
                { name: "months", title: "Months", type: "string" },
                { name: "description", title: "Seasonal Conditions & Experience", type: "text", rows: 2 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "transportNotes",
      title: "Access & Transport Guidance",
      type: "text",
      rows: 4,
      description: "Factual notes on road access (KKH, Gilgit/Skardu flights, typical transfer times). No live road status claims.",
    }),
    defineField({
      name: "practicalInfo",
      title: "Practical Travel Advice & Cultural Etiquette",
      type: "array",
      of: [{ type: "string" }],
      description: "Key bullet points on local etiquette, permits, currency, connectivity, and clothing.",
    }),
    defineField({
      name: "safetyNotes",
      title: "Safety & Environmental Notices",
      type: "text",
      rows: 3,
      description: "Altitude awareness, mountain weather variability, and leave-no-trace guidance.",
    }),
    defineField({
      name: "publicationStatus",
      title: "Publication Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Internal Review", value: "review" },
          { title: "Approved", value: "approved" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
    }),
  ],
});
