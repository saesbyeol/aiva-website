import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
// @sanity/vision is a devDependency: it is a query console for building
// GROQ, and has no business on a public production URL. The import stays
// static so the config reads plainly — only the call below is gated, and
// the minifier drops the unreachable branch from production builds.
//
// The consequence worth knowing: the build needs devDependencies
// installed. Adding --omit=dev or --production to the install step ahead
// of `next build` will fail here with a module-resolution error, not a
// silent misbehaviour.
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
    // Vision is an arbitrary GROQ console. It is genuinely useful while
    // building queries and has no place on a public production URL, so it
    // ships only in development.
    ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },
});
