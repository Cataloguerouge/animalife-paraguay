# Animalife Paraguay

Production-oriented e-commerce monorepo for Animalife Agroveterinaria in Paraguay.

## Stack
- Web: Next.js + TypeScript
- Mobile: Expo + React Native
- Shared domain: TypeScript
- Backend: Supabase/PostgreSQL/Auth/Storage
- Currency: PYG (Guaraníes)

## Status
The repository is being rebuilt from a clean foundation around the approved Animalife UI reference. Demo catalog data is explicitly marked as unverified until commercial/product data is supplied.

## Development
```bash
npm install
npm run dev:web
```

Copy `.env.example` to `.env.local` when Supabase credentials are available.

## Important
Payment and delivery integrations are adapter-based and remain in mock/sandbox mode until real provider credentials and business accounts are authorized.
