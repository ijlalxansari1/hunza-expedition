import { defineField, defineType } from "sanity";

export const experienceType = defineType({
  name: "experience",
  title: "Local Community-Hosted Experience",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Experience Title",
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
      name: "summary",
      title: "Brief Summary",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Experience Details",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "reference",
      to: [{ type: "destination" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "activityCategory",
      title: "Activity Category",
      type: "reference",
      to: [{ type: "activity" }],
    }),
    defineField({
      name: "durationHours",
      title: "Duration (e.g. 3 hours, Half day)",
      type: "string",
    }),
    defineField({
      name: "seasonality",
      title: "Seasonal Availability",
      type: "string",
    }),
    defineField({
      name: "groupSizeLimit",
      title: "Max Group Size",
      type: "string",
    }),
    defineField({
      name: "operationalApprovalStatus",
      title: "Operational & Community Approval Status",
      type: "string",
      options: {
        list: [
          { title: "Proposed (Idea validation stage)", value: "Proposed" },
          { title: "In Review (Host discussions & safety checks in progress)", value: "In Review" },
          { title: "Operationally Approved (Host agreed, fair compensation fixed)", value: "Operationally Approved" },
        ],
      },
      initialValue: "Proposed",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publicationStatus",
      title: "Public Website Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published (Visible on site)", value: "published" },
        ],
      },
      initialValue: "draft",
    }),
  ],
});
