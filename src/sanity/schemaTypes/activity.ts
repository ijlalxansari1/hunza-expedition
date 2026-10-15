import { defineField, defineType } from "sanity";

export const activityType = defineType({
  name: "activity",
  title: "Activity / Interest Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Representative Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "publicationStatus",
      title: "Publication Status",
      type: "string",
      options: {
        list: ["draft", "review", "approved", "published"],
      },
      initialValue: "draft",
    }),
  ],
});
