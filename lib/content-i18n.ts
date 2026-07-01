import * as hr from "./content";
import * as en from "./content.en";

export function getContent(locale: string) {
  return locale === "en" ? en : hr;
}
