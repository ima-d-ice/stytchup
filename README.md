# StytchUp Frontend

Next.js (App Router) storefront for **StytchUp**, a vertical fashion marketplace for made-to-order and custom designer pieces.

Pair backend: `stytchup-backend` (Express + Socket.io + Postgres + Prisma). Run both via `compose.yaml` in the backend repo.

## Features

- **Role-based dashboards** — customer orders (`/orders`), designer fulfillment (`/dashboard`), and an admin ops panel (`/admin`: users, orders, designs). Edge middleware (`middleware.js`) protects authed routes and restricts `/admin/*` to `ADMIN`.
- **Realtime sync** — chat (`new_message`, `offer_created`, `offer_accepted`) plus live order-status patches on both dashboards via `useOrderSocket` (`order_updated`, no reloads).
- **End-to-end order flow** — browse → Razorpay checkout (catalog) or chat offer → measurements → production → ship → confirm delivery, with admin cancel/refund coverage.
- **Auth** — NextAuth credentials + Google; backend JWT kept in the session as `accessToken` and sent as `Bearer` on every API call. Role switching (customer ↔ designer) from the user menu.
- **Media** — UploadThing image uploads (designs, avatars) with INR formatting throughout (`utils/pricing.js`).

## Prerequisites

- Node.js 20+
- Backend running (local `npm run dev` in `stytchup-backend`, or Docker Compose)
- A `.env.local` file (see table below)

## Quickstart

### Option A — Docker Compose (from the backend repo)

```bash
cd ../stytchup-backend
cp .env.example .env   # then fill in secrets
docker compose up --build
```

Frontend on `http://localhost:3000`, API on `http://localhost:4000`.

### Option B — Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. API base defaults to `http://localhost:4000` when `NEXT_PUBLIC_API_URL` is unset.

## Environment (`.env.local`)

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | no (defaults to `http://localhost:4000`) | Backend base URL (REST + sockets) |
| `NEXTAUTH_SECRET` | yes | Session encryption; must match backend |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | for Google login | Google OAuth |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | for payments | Razorpay public key |

Backend also needs the matching `RAZORPAY_KEY_SECRET`; amounts are derived server-side in paise — the client only ever sends `{ sourceId, type }`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint (0 errors) |
| `npm test` | `node:test` suites (15 tests, zero deps) |

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | public | Hero, trending designs, featured designers |
| `/designs`, `/designs/:id` | public | Catalog browse + detail (pay or contact designer) |
| `/designer`, `/designer/:id` | public | Designer list + portfolio |
| `/login`, `/register` | public | Credentials + Google |
| `/dashboard` | designer | Fulfillment queue, measurements, ship |
| `/designs/add` | designer | Publish a design |
| `/orders`, `/orders/:id/submit-requirements` | customer | Purchases, sizing form, confirm delivery |
| `/inbox`, `/inbox/:id` | user | Realtime chat + custom offers + pay |
| `/account-settings` | user | Profile, avatar, socials |
| `/admin` | admin | Users/roles, order cancel/refund, design visibility |
| `/api/auth/*` | — | NextAuth handlers |
| `/api/uploadthing` | — | Upload handler |

## Project structure

```
app/                 # App Router pages (all plain JSX)
  admin/             # admin ops panel (ADMIN-gated)
  api/               # next-auth + uploadthing route handlers
  dashboard/ orders/ inbox/ designs/ designer/
components/          # head (navbar, usermenu, footer), home, designs,
                     # designers, checkout (RazorpayButton, ContactButton),
                     # dashboard (ShipModal), user-settings
utils/               # pricing (paise helpers), conversation (other-user
                     # selector), uploadthing, useOrderSocket (live updates)
middleware.js        # auth + ADMIN gate for /admin/*
tests/               # node:test suites (pricing, conversation, API contract)
Dockerfile           # multi-stage prod image (port 3000, HEALTHCHECK)
.github/workflows/  # ci.yml — install → lint → test → build → docker build
```

## Conventions

- Money is integer **paise** (`₹1 = 100`); format with `formatINR()` from `utils/pricing.js`.
- Every backend call sends `Authorization: Bearer <accessToken>`; sockets connect with `auth: { token: 'Bearer …' }`.
- Backend API docs: `http://localhost:4000/docs`.

## CI

`.github/workflows/ci.yml` runs on push/PR to `main`: `npm ci` → `eslint` → `node --test` → `next build` → `docker build`.
