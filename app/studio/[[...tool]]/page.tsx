/**
 * Sanity Studio — accessible at /studio
 * Server wrapper re-exports metadata; client component handles actual studio rendering.
 */
export { metadata, viewport } from "next-sanity/studio";

import StudioClient from "./StudioClient";

export default function StudioPage() {
  return <StudioClient />;
}
