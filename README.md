# StytchUp Web (React)

Vite + React 19 + react-router SPA for **StytchUp**, ported from the Next.js `../stytchup` app. Talks directly to the Express API (`../stytchup-backend`, default `http://localhost:4000`) — no Next.js BFF.

## Quickstart

```bash
cp .env.example .env   # set VITE_API_URL, VITE_RAZORPAY_KEY_ID, VITE_GOOGLE_CLIENT_ID
npm install
npm run dev            # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server `:3000` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | `node:test` suites (pricing, conversation, apiContract) |

## Env

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_URL` | yes | Express API base (default `http://localhost:4000`) |
| `VITE_RAZORPAY_KEY_ID` | for payments | Razorpay checkout key |
| `VITE_GOOGLE_CLIENT_ID` | for Google login | Google Identity Services client ID |

## Auth

Replaces NextAuth with `src/auth/AuthContext.jsx` (JWT in `localStorage`):

- Credentials: `POST /auth/login {email,password} -> {user, token}`
- Google: `GoogleLogin` credential -> decode email/name -> `POST /auth/google-sync`
- Role switch: `POST /auth/change-role {role: designer|customer}`
- Guards: `<RequireAuth>` / `<RequireAdmin>` in `src/router.jsx` (replaces `middleware.js`)

## Routes

`/`, `/login`, `/register`, `/designs`, `/designs/add` (auth), `/designs/:id`, `/designer`, `/designer/:id`, `/dashboard` (auth), `/orders` (auth), `/orders/:id/submit-requirements` (auth), `/inbox` (auth), `/inbox/:id` (auth), `/account-settings` (auth), `/admin` (admin).

## Docker

```bash
docker build -t stytchup-web --build-arg VITE_API_URL=http://localhost:4000 .
docker run -p 8080:80 stytchup-web
```

`nginx.conf` includes SPA fallback (`try_files ... /index.html`).

## Notes vs Next.js version

- No SSR (`force-dynamic` pages became `useEffect` + skeletons); no `next/image` optimization (plain `<img loading="lazy">`).
- No `app/api/*` BFF: auth/upload call Express directly. Image upload is URL-based for now — wire Express `POST /uploads` for file uploads.
- Money stays integer **paise** (`src/utils/pricing.js`); Razorpay `create-order` sends `{sourceId, type}` only.
