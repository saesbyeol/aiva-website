import { defineField, defineType } from "sanity";

export const videoAd = defineType({
  name: "videoAd",
  title: "Video Oglas",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Naziv oglasa",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: [
          { title: "Video oglas", value: "Video Oglas" },
          { title: "UGC video", value: "UGC Video" },
          { title: "Carousel oglas", value: "Carousel Oglas" },
          { title: "Reels / TikTok", value: "Reels / TikTok" },
          { title: "Product video", value: "Product Video" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tags",
      title: "Tagovi",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "video",
      title: "Video datoteka",
      type: "file",
      options: { accept: "video/*" },
      validation: (r) => r.required(),
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
    select: { title: "title", subtitle: "category" },
  },
  orderings: [
    { title: "Redoslijed", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
