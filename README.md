# Xiaowu dev portfolio

Static React site for listing apps and showcasing the JLPT product. See [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) for stack, routes, and GitHub Pages `base` notes.

## Scripts

- `npm run dev`: local dev server
- `npm run build`: typecheck, Vite build, copy `index.html` to `404.html` for GitHub Pages SPA fallback
- `npm run preview`: preview production build

## GitHub Pages

Set the repo name in `vite.config.ts` or override with `VITE_BASE=/your-repo/` when building. Publish the contents of `dist/`.
