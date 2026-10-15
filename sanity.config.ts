'use client';

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  basePath: "/studio",
  name: "hunza_expeditions_studio",
  title: "Hunza Expeditions — Content Studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Tourism Management")
          .items([
            S.listItem()
              .title("Destinations & Regions")
              .child(S.documentTypeList("destination").title("Destinations")),
            S.listItem()
              .title("Tours & Itineraries")
              .child(S.documentTypeList("tour").title("Tours")),
            S.listItem()
              .title("Community Experiences")
              .child(S.documentTypeList("experience").title("Local Experiences")),
            S.listItem()
              .title("Activity Categories")
              .child(S.documentTypeList("activity").title("Activities & Interests")),
            S.divider(),
            S.listItem()
              .title("Customer Journey Enquiries")
              .child(S.documentTypeList("enquiry").title("Customer Enquiries")),
            S.divider(),
            S.listItem()
              .title("Guides & Team")
              .child(S.documentTypeList("guide").title("Local Guides")),
            S.listItem()
              .title("Travel Guide Articles")
              .child(S.documentTypeList("article").title("Editorial Guides")),
            S.listItem()
              .title("FAQs")
              .child(S.documentTypeList("faq").title("Frequently Asked Questions")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
