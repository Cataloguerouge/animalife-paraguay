# Animalife Paraguay architecture

## Apps
- apps/web: responsive Vite + React storefront.
- apps/mobile: React Native/Expo storefront.
- apps/api: small Node HTTP prototype API.

## Shared domain
packages/domain contains catalog types, customer/order contracts, Guaraní formatting, demo catalog data, and provider interfaces.

## Commerce boundaries
PaymentProvider and DeliveryProvider isolate Paraguay-specific providers from checkout. The MVP uses mock adapters only. A real provider should implement the same interface and read credentials from environment/secret storage.

## Order flow
1. Storefront creates a cart from catalog/API products.
2. Checkout selects standard or express shipping and card, transfer or QR.
3. API creates an order and asks the delivery/payment adapters for quote/intent.
4. Next phase can add persistent auth, database storage, webhooks and stock reservation without changing storefront contracts.

## Security
No payment credentials, API keys, tokens or secrets belong in source control. .env.example contains names only.
