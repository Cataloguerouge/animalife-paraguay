# Approved MagicPath source — import staging

This directory is reserved for the **approved MagicPath implementation** and is deliberately isolated from the current production application.

## Canonical design sources

- Project canvas: https://www.magicpath.ai/files/459271459794206720
- Approved responsive storefront: https://designs.magicpath.ai/v1/clever-flood-5220
- Approved mobile prototype: https://designs.magicpath.ai/v1/smooth-world-9042

## Import status

**The actual exported source code has not yet been imported.** MagicPath's authenticated external-agent API returned `EXTERNAL_AGENT_API_QUOTA_EXCEEDED` (50 of 50 calls used). The preview URLs expose the rendered prototypes, but they are not a source archive. This staging directory must not be mistaken for the exported implementation.

MagicPath's documented export path is to open each design, choose **Code**, then **Download** to obtain the codebase ZIP. Once an authenticated export or source archive is accessible, unpack the real source here and preserve assets, dependencies, and license/attribution notes.

## Import rules

1. Keep the web and mobile exports distinct (for example, `web/` and `mobile/`).
2. Do not overwrite `apps/web` or `apps/mobile` until the imported source builds and is compared with the approved previews.
3. Preserve the original export files and document any adaptation needed to integrate with the existing Next.js/Expo monorepo.
4. Do not treat illustrative prototype products, prices, or images as verified live inventory.
5. Do not deploy this staging directory by itself.

This directory is an honest staging marker, not a substitute for the actual source export.
