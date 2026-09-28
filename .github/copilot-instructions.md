# Workspace Guidance

- This workspace is a React 19 + TypeScript app built with Vite.
- Use Redux Toolkit for shared dashboard state; the store is in `src/app/store.ts` and the dashboard slice is in `src/app/dashboardSlice.ts`.
- Keep the responsive admin UI aligned with the existing Northstar visual system in `src/App.css` and `src/index.css`.
- Dashboard values in `src/App.tsx` are local demo fixtures. Do not present them as live data; connect real service data through a Redux data layer when an API is available.
- Run `npm run build` and `npm run lint` after code changes.
