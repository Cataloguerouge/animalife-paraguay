# Animalife Paraguay

Animalife Agroveterinaria e-commerce foundation for Paraguay: responsive web shop + React Native/Expo mobile app + shared commerce domain + API boundary.

## What is in the MVP

The catalog seed follows the Animalife UI reference supplied in the project conversation, including Raguife Prime, Fluralab, Ranger, Calbos, Hipofen, Cidental and Morlan products with Guaraní pricing. fileciteturn14file0

The web MVP includes:
- Product search and category navigation
- Product cards and product-detail modal
- Cart with quantity controls and totals
- Checkout with Paraguay delivery choices: standard 30,000 Gs / 1–3 days and express 50,000 Gs / 24 hours
- Payment method abstraction in the UI: card, bank transfer and QR
- Customer account/order history demo
- Admin product-management demo
- Responsive mobile/desktop layout based on the supplied Animalife design language

The mobile MVP includes the same shared catalog, search, categories, product detail and cart flow through Expo.

The checkout structure mirrors the supplied reference, including contact/address fields and local payment/delivery options. fileciteturn14file2

## Architecture

- apps/web — Vite + React storefront
- apps/mobile — Expo Router / React Native storefront
- apps/api — Node HTTP prototype API
- packages/domain — shared TypeScript contracts, demo catalog and provider interfaces

Payment and delivery are deliberately behind PaymentProvider and DeliveryProvider interfaces. Current adapters are safe in-memory/mock providers. Real Paraguay providers can be added later without changing the checkout domain contract.

## Run locally

    npm install

    # Web storefront
    npm run dev:web

    # API (second terminal)
    npm --workspace apps/api start

    # Mobile
    npm run start:mobile

Vite serves the web app locally. Expo serves the mobile app to Expo Go / an emulator.

## API prototype

- GET /health
- GET /api/products
- GET /api/products/:slug
- POST /api/shipping/quote
- POST /api/orders
- GET /api/orders/:id
- GET /api/admin/products

The prototype stores orders in memory for the current process; authentication, persistent database storage, stock reservation, provider webhooks and real payment/delivery connections are next-stage production work.

## Security

Do not commit API keys, payment credentials, shipping credentials, auth secrets or database passwords. .env.example contains variable names only.

## Deployment

render.yaml contains a Render API service and static web service definition. No production credentials are committed.
