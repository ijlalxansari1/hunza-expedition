import { defineField, defineType } from "sanity";

export const guideType = defineType({
  name: "guide",
  title: "Local Guide & Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Specialty",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biography & Local Experience",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "languages",
      title: "Languages Spoken",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "expertiseAreas",
      title: "Areas of Expertise",
      type: "array",
      of: [{ type: "string" }],
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
