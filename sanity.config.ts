import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "aiva",
  title: "Aiva Studio",
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Sadržaj")
          .items([
            S.listItem()
              .title("📁 Projekti (Case Studies)")
              .child(S.documentTypeList("caseStudy").title("Projekti")),
            S.listItem()
              .title("🎬 Video oglasi")
              .child(S.documentTypeList("videoAd").title("Video oglasi")),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
