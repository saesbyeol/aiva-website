# Vendored third-party bundles

Third-party JavaScript served from our own origin instead of a public CDN,
so that a compromised or malicious upstream publish cannot execute on
aiva.hr without us choosing to ship it.

| File                                   | Package                           | Version  | SHA-384                                                                                            | Vendored   |
| -------------------------------------- | --------------------------------- | -------- | -------------------------------------------------------------------------------------------------- | ---------- |
| `public/vendor/convai-widget-embed.js` | `@elevenlabs/convai-widget-embed` | `0.18.2` | `9ee2b00886679c6eed6eae4ec5837518251cf42683c51fc38d0392107bb2f87b59120bb1f8645064c6cf2793a1d2f168` | 2026-09-15 |

## Updating

1. Download the new exact version from `https://unpkg.com/<pkg>@<version>`.
2. Diff it against the current file and skim the diff. A vendored bundle you
   have not looked at provides provenance, not safety.
3. Update the version and hash in this table in the same commit as the file.
