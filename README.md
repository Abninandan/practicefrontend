# Northstar Admin Dashboard

A responsive React + TypeScript admin dashboard built with Vite, Redux Toolkit, Recharts, and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL after startup. Use `npm run build` to create a production build and `npm run lint` to run Oxlint.

## API configuration

Set `VITE_API_BASE_URL` in `.env` to the API root (for example, `http://localhost:3000/api`). Copy `.env.example` when creating a local environment file, and restart Vite after changing environment values.

The frontend routes are `/admin/login` and the protected `/admin/dashboard` (with section paths under `/admin/dashboard/:section`). The frontend expects `POST /admin/login` with `{ "email", "password" }` and a response shaped as `{ "token", "user": { "id", "name", "email", "role" } }`. It then calls `GET /admin/dashboard` to verify the session. RTK Query sends the token as `Authorization: Bearer <token>` on requests; a `401` clears the Redux session and returns the user to `/admin/login`. Other client routes are not protected by this admin guard.

## Dashboard

The Overview page shows sample revenue, sales channel, and order data. Orders, Customers, Inventory, and Reports provide searchable demo tables. Navigation, the date-range selector, search state, and active section are managed in Redux. The export action downloads a sample orders CSV.

The login and protected dashboard requests are connected to the API. The overview chart and table values are still local demo fixtures in `src/App.tsx`; replace them with fields from your API response before treating them as live business data.
