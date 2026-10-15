import { defineField, defineType } from "sanity";

export const articleType = defineType({
  name: "article",
  title: "Travel Guide Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Article Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Excerpt",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "body",
      title: "Article Content",
      type: "text",
      rows: 10,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      initialValue: "Hunza Expeditions Editorial Team",
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
    }),
    defineField({
      name: "relatedDestinations",
      title: "Related Destinations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "destination" }] }],
    }),
    defineField({
      name: "publicationStatus",
      title: "Publication Status",
      type: "string",
      options: {
        list: ["draft", "published"],
      },
      initialValue: "draft",
    }),
  ],
});
