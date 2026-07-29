# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **frontend-only Vite + React 19 + TypeScript SPA** (`pixi-portfolio`, a design portfolio). There is no backend, database, or external service — the only service to run is the Vite dev server.

### Services

| Service | Command | Notes |
| --- | --- | --- |
| Vite dev server | `npm run dev` | Serves the SPA at `http://localhost:5173`. Only service needed to run/test the app end-to-end. |

### Common commands (see `package.json` scripts)

- Lint: `npm run lint` (ESLint). Currently emits 2 pre-existing warnings and 0 errors — a clean run is warnings-only.
- Build + typecheck: `npm run build` (runs `tsc -b` then `vite build`). The build prints a chunk-size >500 kB warning for the main bundle (pixi.js is large); this is expected, not an error.
- Preview production build: `npm run preview`.

### Notes / gotchas

- Package manager is **npm** (`package-lock.json`); do not introduce yarn/pnpm.
- Images under `src/assets` are transformed to WebP at build time via `vite-imagetools`.
- Client-side routing is custom (no react-router); deep links like `/kinja` rely on `vercel.json` SPA rewrites in production. In `npm run dev`, Vite serves `index.html` for these routes automatically.
