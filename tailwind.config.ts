// Tailwind v4 uses CSS-first config via @theme in globals.css
// This file is kept for IDE support / v3 compatibility tooling only.
// See styles/globals.css for the actual theme configuration.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
