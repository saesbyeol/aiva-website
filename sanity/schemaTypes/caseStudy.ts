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
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "client", maxLength: 96 },
      validation: (r) => r.required(),
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
      title: "Naslovna slika",
      type: "image",
      options: { hotspot: true },
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
