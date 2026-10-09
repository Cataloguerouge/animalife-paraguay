# Animalife Paraguay — Development Journal

## Purpose
This journal is the single running source of truth for future ChatGPT sessions working on Animalife Paraguay. Read it before making architectural, visual, deployment, payment, or data changes.

## Product
Animalife Paraguay is a premium Spanish-language e-commerce platform for Paraguay covering companion animals, veterinary products, livestock and campo products.

Reference/design:
- Approved visual reference: `Animalife Agroveterinaria E-commerce UI Collage.png`
- Informational/design reference only: https://animalife.replit.app
- Production web: https://animalife-paraguay-web.onrender.com
- Repository: https://github.com/Cataloguerouge/animalife-paraguay

## Approved design direction
- Premium, clean, trustworthy, modern green/white visual language.
- Strong editorial photography of animals and campo.
- Excellent mobile UX.
- Spanish / Paraguay.
- Do not replace the approved visual direction with generic dashboard/e-commerce styling.
- Do not ask for approval after every small step. Continue autonomously unless credentials, permissions, or an unavoidable business/legal decision is required.

## Architecture
- Monorepo: npm workspaces.
- Web: Next.js + TypeScript.
- Mobile: Expo / React Native + TypeScript.
- Shared package: `packages/shared`.
- Backend: Supabase PostgreSQL/Auth/Storage/RLS.
- Web and mobile use the same production API/backend/catalog/order model.
- Currency: integer PYG values.
- Payment and delivery are adapter-based; real providers are only activated when business credentials/configuration exist.

## Completed milestones

### Foundation
- Clean monorepo structure created.
- Web, mobile and shared TypeScript packages established.
- Supabase schema/migrations established through migration 011.
- Supabase Auth and role-aware admin foundation implemented.
- Product/catalog API and order API implemented.
- Guest checkout supported.
- Inventory reservation/decrement and overselling protection implemented.
- Order, payment and delivery statuses separated.

### Security / order flow
- `create_order` is SECURITY DEFINER with restricted search path.
- Guest checkout does not accept arbitrary user IDs.
- Authenticated users cannot spoof another user ID.
- Product must be active and verified before purchase.
- Stock is locked and checked during order creation.
- Delivery quote is validated server-side.
- Test transaction was executed and rolled back; no test order remains.

### Payments
- Provider adapter implemented.
- Mock provider works without merchant credentials.
- Pagopar adapter implemented and configurable.
- Pagopar webhook Edge Function deployed.
- Real Pagopar credentials are NOT configured yet.
- Never claim that real financial payments are live until merchant credentials and a successful controlled test are completed.

### Delivery
- Mock delivery provider implemented:
  - Asunción/Central: Gs. 25,000
  - Other zones: Gs. 45,000
  - ETA: 1–3 business days
- Real courier integration is not activated yet.

### Admin
- Admin dashboard reads live Supabase data.
- Products: live stock, active and verified controls.
- Orders: live order list and status changes.
- Full CRUD for every future admin module is still a later expansion item.

## Visual development history

### Initial approved implementation
- Premium homepage structure.
- Premium header/navigation.
- Hero, trust strip, category cards, featured products, editorial/story section and CTA.
- Responsive layouts.
- Account, catalog, product, cart and checkout pages.

### AI photography
- AI-generated animal/campo imagery was introduced instead of generic stock placeholders.
- Shared AI hero asset lives in `packages/shared/src/ai-assets.ts`.
- The current production visual direction should keep photographic animal imagery prominent.

### 2026-10-09 visual correction — category section
Problem found in production QA: the category section still rendered simplistic SVG/icon artwork and an intentionally oversized first card, which was visibly below the approved premium standard.

Fixes committed:
- Replaced category SVG placeholders in the homepage with the shared AI photographic animal asset.
- Added animal-specific crop positioning for companion animals, bovinos, equinos, campo and veterinary imagery.
- Normalized the desktop category grid to five balanced premium cards instead of the oversized first-card layout.
- Improved card proportions, image fill, hover treatment and photographic contrast.
- Kept the mobile layout balanced rather than making the first category a full-width oversized tile.

Commits:
- `808da4867c1f08fb11ade0a8f1596cb8aa224a0f` — replace placeholder category art with premium animal photography.
- `8d5eee163a68210b259e690ef8846f1cd53d389a` — normalize premium category grid and restore photographic imagery.

### 2026-10-08 visual correction
Problem found: the homepage had premium JSX sections but the stylesheet did not contain the corresponding `hero-gallery`, premium category, editorial story and premium CTA rules. This caused the frontend to look substantially worse than the approved design.

Fixes committed:
- Restored full premium hero/gallery styling.
- Restored premium category presentation.
- Restored editorial story section.
- Restored premium CTA treatment.
- Replaced emoji-only product fallbacks with real local category/product artwork:
  - `/products/perros-gatos.svg`
  - `/products/bovinos.svg`
  - `/products/equinos.svg`
  - `/products/campo.svg`
  - `/products/veterinario.svg`
- Preserved verified real product photography where available.
- Current homepage should visually prioritize photography and real artwork rather than emoji placeholders.

### 2026-10-09 photographic asset recovery — verification correction
The attempted local file `apps/web/public/animalife/category-collage.webp` was not verified as a valid WebP image. It must not be treated as approved photography and is being removed from active use.

Recovery applied:
- Restored the existing shared `ANIMALIFE_AI_HERO` asset for the main pet hero; its embedded data URI has a WebP header.
- Used existing local category artwork for cat, bovine, equine, veterinary and campo tiles as a safe fallback rather than referencing the unverified collage file.
- Corrected a stale `ANIMALIFE_AI_HERO` reference that caused the Render build to fail TypeScript checking.
- Dedicated approved photographic files for each animal/category still need to be supplied through a verified asset workflow (Figma/MagicPath connection or another verified source). Do not claim those dedicated photos are complete yet.

Commits:
- `c51e8915d8351c883b421aa8f7fd9258947b2d24` — remove stale AI hero reference.
- `36217871c6787b55db70eef73fe7928f6796d39d` — restore valid hero and category image sources.
- `6f508644aaae648b7b88cacc4d610ba2610d5b52` — use verified fallback image sources.

## Deployment history
- Correct production Render service:
  - Name: `animalife-paraguay-web`
  - Type: Node web service
  - Region: Virginia
  - Plan: Free
  - Auto deploy from GitHub main
  - Build: `npm install && npm run build:web`
  - Start: `npm run start:web`
  - URL: https://animalife-paraguay-web.onrender.com

- Old unnecessary Render service:
  - Name: `animalife-paraguay`
  - Type: Static Site
  - It incorrectly expects `apps/web/dist`.
  - It is NOT the production service.
  - It should be deleted.

## Important deployment rule
Do not create another Render service for the same production app. Use `animalife-paraguay-web`.

A `render.yaml` blueprint was added so the repository declares the correct Node web-service configuration.

## Current commits
Recent important commits:
- `603e65a2cb18a1e625aa2a7a7b0b3fcacd54fc14` — React Native style typing fix.
- `5ee470d6ec0381675f8567f036215a0086bed228` — Render production web-service blueprint.
- `27b157ec46c8ec79594d2e35e50a75c9ee06eac5` — restore category and product imagery.
- `67f7e67c679060e6e7afb4a3689a03d2fca34e55` — restore approved premium storefront layout.

## Mobile app
- Source: `apps/mobile/App.tsx`
- Uses the same production API/backend.
- Includes home, catalog, search/filtering, product detail, cart, checkout, order confirmation and account.
- Mobile TypeScript CI check is enabled.
- Native iOS/Android signed builds have NOT been claimed as complete because EAS build credentials are not configured.

## Product-data rule
Never invent product facts, package sizes, prices, brands, regulatory status or product images.
Unknown data must be marked for verification.
Confirmed example data includes:
- FINOTRATO PRIME — Brazilian dog food, 15 kg; exact variant details still require verification.
- FLURALAB BOVINOS 5% — fluralaner 5%, 1 L, cattle pour-on antiparasitic.
- Raguife Prime references are design/demo references unless verified as current inventory.

## Next work priorities
1. Verify the latest production deployment after the 2026-10-09 category photography/grid correction.
2. Delete the obsolete Render Static Site `animalife-paraguay`.
3. Continue visual QA against the approved collage at desktop and mobile widths.
4. Replace remaining generic/category fallback art with verified product photography as product data becomes available.
5. Expand admin CRUD only where it improves real operational readiness.
6. Activate Pagopar only after merchant credentials are supplied.
7. Activate real delivery only after the courier/provider is selected and credentials/configuration are available.

## Working rule for future chats
Before changing code:
1. Read this journal.
2. Inspect the current repository rather than assuming prior code still exists.
3. Keep the approved design as the visual source of truth.
4. Make complete changes and validate them.
5. Do not stop for routine decisions.
6. Stop only for missing credentials/permissions or an unavoidable business/legal decision.


## 2026-10-09 MagicPath design milestone
- Created MagicPath project: Animalife Paraguay — Approved Storefront Design.
- Project canvas: https://www.magicpath.ai/files/459271459794206720
- Responsive storefront component preview: https://designs.magicpath.ai/v1/clever-flood-5220
- Mobile app screen component preview: https://designs.magicpath.ai/v1/smooth-world-9042
- Both MagicPath component builds completed successfully. They are design prototypes, not native mobile binaries.
- Storefront prototype includes Spanish/Paraguay brand direction, responsive navigation, category imagery, featured product cards, story/CTA sections, mobile menu, search, cart count and responsive layouts.
- Mobile prototype includes home, category browsing, product cards, cart count, tab navigation, search and a responsive mobile-first visual system.
- Production homepage update: category cards now use animal/campo photographic URLs with a dark readability overlay. Commit: 587eab73301b3415f4d7fd17cb40750643b9db4a.
- Important: category imagery is loaded from Unsplash URLs, so images require external network access. Product cards in MagicPath are illustrative mock data and must not be treated as verified inventory/pricing. The live storefront continues to use the real catalog/backend.
- Remaining launch blockers: real Pagopar merchant credentials and controlled payment test; real courier integration/credentials; native iOS/Android signed builds and EAS credentials; final browser QA of external image URLs on production.


## 2026-10-09 — Six-category demo catalog and production deployment
- Supabase project `mdswufrddbzfbgsalksq`: migration `seed_animalife_demo_catalog_36` applied successfully.
- Added the missing `Veterinaria` category and 36 demo product records: exactly six each for Perros, Gatos, Bovinos, Equinos, Campo and Veterinaria. Preserved the original six non-demo products.
- Demo products use stable `DEMO-*` SKUs, illustrative descriptions and Guaraní prices, unique external Pexels image URLs, stock=0, verified=false, featured=false. They are not verified inventory and are not purchasable until real stock/pricing/records are confirmed.
- Added the repeatable seed migration source at `supabase/migrations/20261009120000_seed_animalife_demo_catalog_36.sql`.
- `apps/web/lib/catalog-server.ts` now recognizes absolute HTTP(S) image URLs in `products.image_path`; existing relative Supabase Storage paths continue to work.
- Homepage category image mapping now differentiates dogs from cats, plus cattle, horses, veterinary care and rural field imagery. The homepage category showcase now renders six non-offer categories. The no-Supabase fallback category list includes Veterinaria.
- Catalog and product detail images now have descriptive alt text; catalog product images use lazy loading.
- MagicPath design references: web https://designs.magicpath.ai/v1/clever-flood-5220; mobile https://designs.magicpath.ai/v1/smooth-world-9042; canvas https://www.magicpath.ai/files/459271459794206720. These are separate design prototypes; the deployed source remains this Next.js/Supabase monorepo.
- Render service: `animalife-paraguay-web`, ID `srv-db3sednlk1mc73coacgg`, connected to GitHub branch `main`, automatic deployment on commit. Production URL: https://animalife-paraguay-web.onrender.com.
- Test notes: Supabase migration returned success. Before marking this release done, verify live counts (36 DEMO rows and 42 total products), inspect GitHub commit/status, check Render deployment, and run production HTTP smoke checks. External Pexels/Unsplash image requests still need rendered-browser validation.
- Commercial launch caveat: demo products are explicitly unverified and have zero stock; remove/replace them before live sales.
