import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system defines its own type scale as `.text-h1`, `.text-body`,
 * `.text-label` and friends (see styles/globals.css). Stock tailwind-merge has
 * no way to know these are font-size utilities, so it files them under the
 * `text-color` group and silently drops them whenever a real colour class
 * follows: `twMerge("text-h2 text-fg")` returned just `"text-fg"`, leaving
 * every SectionHeading title rendering at body size.
 *
 * Teaching the merger about the custom scale keeps size and colour in separate
 * conflict groups, so `text-h2 text-fg` survives intact while a genuine clash
 * like `text-h2 text-h4` still resolves to the last one wins.
 */
const TYPE_SCALE = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "body-lg",
  "body",
  "small",
  "label",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trim()}…`;
}
