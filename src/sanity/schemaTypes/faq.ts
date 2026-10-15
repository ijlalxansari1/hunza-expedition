import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "Frequently Asked Question",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Planning & Booking", value: "planning" },
          { title: "Practical Travel & Packing", value: "practical" },
          { title: "Weather & Seasons", value: "seasons" },
          { title: "Culture & Etiquette", value: "culture" },
        ],
      },
      initialValue: "planning",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "publicationStatus",
      title: "Publication Status",
      type: "string",
      options: {
        list: ["draft", "published"],
      },
      initialValue: "published",
    }),
  ],
});
