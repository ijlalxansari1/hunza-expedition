import { defineField, defineType } from "sanity";

export const enquiryType = defineType({
  name: "enquiry",
  title: "Customer Journey Enquiry",
  type: "document",
  fields: [
    defineField({
      name: "referenceId",
      title: "Unique Reference ID",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submission Timestamp",
      type: "datetime",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Workflow Status",
      type: "string",
      options: {
        list: [
          { title: "New (Received)", value: "new" },
          { title: "Under Review", value: "under_review" },
          { title: "Preparing Quotation", value: "preparing_quotation" },
          { title: "Quotation Sent", value: "quotation_sent" },
          { title: "Confirmed (Manual)", value: "confirmed_manual" },
          { title: "Closed", value: "closed" },
          { title: "Not Feasible", value: "not_feasible" },
        ],
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Traveller Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone / WhatsApp",
      type: "string",
    }),
    defineField({
      name: "preferredContact",
      title: "Preferred Contact Method",
      type: "string",
    }),
    defineField({
      name: "countryOfResidence",
      title: "Country of Residence",
      type: "string",
    }),
    defineField({
      name: "durationDays",
      title: "Approximate Duration (Days)",
      type: "number",
    }),
    defineField({
      name: "travellersCount",
      title: "Travellers (Adults / Children)",
      type: "string",
    }),
    defineField({
      name: "selectedDestinations",
      title: "Requested Destinations",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "selectedInterests",
      title: "Requested Interests",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "budgetEstimate",
      title: "Budget Estimate",
      type: "string",
    }),
    defineField({
      name: "accommodationStyle",
      title: "Accommodation Preference",
      type: "string",
    }),
    defineField({
      name: "specialRequests",
      title: "Special Requests / Notes",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "internalNotes",
      title: "Hunza Expeditions Internal Notes",
      type: "text",
      rows: 4,
      description: "Private operational review notes by Hunza Expeditions staff.",
    }),
  ],
});
