import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study / Projekt",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Naziv projekta",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "client",
      title: "Klijent",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: [
          { title: "AI Automatizacija", value: "AI Automatizacija" },
          { title: "AI Pipeline-ovi za Sadržaj", value: "AI Pipeline-ovi za Sadržaj" },
          { title: "Prilagođene LLM Aplikacije", value: "Prilagođene LLM Aplikacije" },
          { title: "AI Web Stranice", value: "AI Web Stranice" },
          { title: "AI Chatbotovi", value: "AI Chatbotovi" },
          { title: "AI Marketing", value: "AI Marketing" },
          // Sub-filter categories for the "AI slike" (Generiranje slika) chip
          { title: "Ecommerce", value: "Ecommerce" },
          { title: "Fashion", value: "Fashion" },
          { title: "Marketing kampanje", value: "Marketing kampanje" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Godina",
      type: "string",
      initialValue: new Date().getFullYear().toString(),
    }),
    defineField({
      name: "tags",
      title: "Tagovi",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "description",
      title: "Kratki opis (za karticu)",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "approach",
      title: "Pristup / Rješenje",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "results",
      title: "Rezultati",
      type: "array",
      of: [{ type: "string" }],
      description: "Dodajte svaki rezultat kao zasebnu stavku",
    }),
    defineField({
      name: "coverImage",
      title: "Naslovna slika (thumbnail kartice)",
      type: "image",
      description: "Prikazuje se na kartici u galeriji radova",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Galerija (slike i videi)",
      type: "array",
      description:
        "Prikazuje se na stranici projekta — dodajte slike i/ili videe u željenom redoslijedu",
      of: [
        {
          type: "image",
          title: "Slika",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Opis slike (opcionalno)",
              type: "string",
            },
          ],
        },
        {
          type: "object",
          name: "galleryVideo",
          title: "Video",
          fields: [
            {
              name: "file",
              title: "Video datoteka",
              type: "file",
              options: { accept: "video/*" },
              validation: (r) => r.required(),
            },
            {
              name: "caption",
              title: "Opis videa (opcionalno)",
              type: "string",
            },
          ],
          preview: {
            select: { title: "caption", fileName: "file.asset.originalFilename" },
            prepare({ title, fileName }) {
              return { title: title || fileName || "Video", subtitle: "Video" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "mediaDescription",
      title: "Opis ispod galerije",
      type: "text",
      rows: 4,
      description: "Tekst koji se prikazuje ispod galerije na stranici projekta (opcionalno)",
    }),
    defineField({
      name: "featured",
      title: "Istaknuti projekt",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Redoslijed prikaza",
      type: "number",
      description: "Manji broj = prikazuje se prvi",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "coverImage" },
  },
  orderings: [
    { title: "Redoslijed", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Godina (novo)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
  ],
});
