# StytchUp Web

StytchUp is a marketplace for made-to-order and custom designer fashion. This is the customer- and designer-facing storefront: a Vite + React 19 SPA with a quiet, editorial look — white canvas, black ink, one yellow accent, and serif display type.

It talks directly to the Express API in [`../stytchup-backend`](../stytchup-backend), or runs entirely on local fixtures in **demo mode**.

![StytchUp demo — storefront, catalogue, chat, designer studio, and admin](docs/demo.gif)

[Watch the full walkthrough (MP4, 68s)](docs/demo.mp4)

## Demo mode (no backend required)

The quickest way to see the whole app. Use Node 22 (`.nvmrc`); Vite 8 needs a current LTS.

```bash
cp .env.example .env     # demo flags are already set in the example
npm install
npm run dev              # http://localhost:3000
```

`.env`:

```ini
VITE_DEMO_MODE=true
VITE_DEMO_FALLBACK=true
```

Demo mode serves the catalogue, designers, orders, chat, and admin data from `src/data/demo.js`, and simulates checkout, shipping, publishing, profile saves, and message sending. No Postgres, Docker, or API server is needed.

### Demo accounts

The login screen has one-click **Use Customer / Use Designer / Use Admin** buttons. You can also type the credentials:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@stytchup.com` | `customer1234` |
| Designer | `designer@stytchup.com` | `designer1234` |
| Admin | `admin@stytchup.com` | `admin1234` |

The account menu can switch between customer and designer without signing out. Admin is only available through the admin login.

### What's in the demo data

- 10 designs across outerwear, menswear, womenswear, and resort, by 4 designers
- Customer orders in `IN_PROGRESS`, `SHIPPED`, and `COMPLETED` states
- Designer orders awaiting measurements, in progress, and shipped
- A customer/designer conversation with a pending bespoke offer
- Admin lists for orders, users, and design visibility

## Full-stack quickstart

```bash
# Terminal 1 — API
cd ../stytchup-backend
npm ci
cp .env.example .env     # set DATABASE_URL and secrets
npx prisma generate
npx prisma db push
npm run seed             # demo accounts, designs, orders, and chat
npm run dev              # http://localhost:4000

# Terminal 2 — web
cp .env.example .env
# set VITE_DEMO_MODE=false
npm ci
npm run dev              # http://localhost:3000
```

See the [backend README](../stytchup-backend/README.md) for the API, schema, and seed details.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server on `:3000` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | `oxlint` |
| `npm test` | `node:test` suites (pricing, conversations, API contract) |
| `npm run demo:record` | Playwright walkthrough → `docs/demo.webm` (needs `npm run dev`) |
| `npm run demo:render` | ffmpeg → `docs/demo.mp4` + `docs/demo.gif` |

## Env

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_URL` | full-stack | Express API base (default `http://localhost:4000`) |
| `VITE_DEMO_MODE` | no | Use local fixtures and demo auth; no API calls |
| `VITE_DEMO_FALLBACK` | no | Fall back to fixtures if the API is unreachable |
| `VITE_RAZORPAY_KEY_ID` | payments | Razorpay checkout key |
| `VITE_GOOGLE_CLIENT_ID` | Google login | Google Identity Services client ID |

## Auth

Auth lives in `src/auth/AuthContext.jsx` (JWT in `localStorage`):

- Credentials: `POST /auth/login {email,password} -> {user, token}`
- Google: `GoogleLogin` credential -> decode email/name -> `POST /auth/google-sync`
- Role switch: `POST /auth/change-role {role: designer|customer}`
- Guards: `<RequireAuth>` / `<RequireAdmin>` in `src/router.jsx`

## Routes

`/`, `/login`, `/register`, `/designs`, `/designs/add` (auth), `/designs/:id`, `/designer`, `/designer/:id`, `/dashboard` (auth), `/orders` (auth), `/orders/:id/submit-requirements` (auth), `/inbox` (auth), `/inbox/:id` (auth), `/account-settings` (auth), `/admin` (admin).

## Design notes

- Tailwind v4 via `@tailwindcss/vite`; theme tokens and shared classes in `src/index.css`.
- Money is integer **paise** (`src/utils/pricing.js`); Razorpay `create-order` sends `{sourceId, type}` only.
- No SSR and no `next/image`: plain `<img loading="lazy">`.
- No Next.js BFF: auth and uploads call Express directly. Image upload is URL-based; wire `POST /uploads` for files.

## Recording the demo

The walkthrough is scripted in `scripts/record-demo.mjs` and rendered by `scripts/render-demo.sh`. It needs Google Chrome, Playwright, and ffmpeg:

```bash
npm run dev              # in another terminal, demo mode on
npx playwright install ffmpeg   # one-time, for video capture
npm run demo:record
npm run demo:render
```

The script signs in with each demo account, filters the catalogue, opens a product and designer, sends a chat message, updates an order in the designer studio, and visits the admin tabs.

## Demo imagery

All photographs are from [Unsplash](https://unsplash.com) and used under the [Unsplash License](https://unsplash.com/license). They are downloaded locally into `public/demo/` by `scripts/download-demo-images.sh`; the source photo IDs are listed in that script. Swap in your own campaign imagery before production.

## Docker

```bash
docker build -t stytchup-web --build-arg VITE_API_URL=http://localhost:4000 .
docker run -p 8080:80 stytchup-web
```

`nginx.conf` includes SPA fallback (`try_files ... /index.html`).
