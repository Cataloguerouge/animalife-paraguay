# Animalife API prototype

Node HTTP API with shared @animalife/domain contracts.

Routes:
- GET /health
- GET /api/products
- GET /api/products/:slug
- POST /api/shipping/quote
- POST /api/orders
- GET /api/orders/:id
- GET /api/admin/products

Payment and delivery are mock providers only. Replace the provider adapters later without changing checkout/domain contracts.