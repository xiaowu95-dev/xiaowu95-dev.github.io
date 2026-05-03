# Project context anchor

Use this file to keep agents and humans aligned. Update when scope, deploy URL, or stack changes.

## Intent

Static React portfolio centered on **Kogo**, a Japanese study app (lessons, spaced review, JLPT practice). Visual language: matte black, metallic gold, editorial serif + modern sans, generous space, calm hero and feature sections.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- react-router-dom v7
- framer-motion + lucide-react

## Repository and deploy

- **GitHub Pages** expects the production bundle under the repo’s Pages root.
- **Vite `base`:** default in `vite.config.ts` is `/xiaowu_dev/` (match your GitHub repo name). For a user site (`username.github.io`), set `base: '/'`. You can override with env `VITE_BASE` at build time.

## Routes

| Path | Page |
|------|------|
| `/` | `Home.tsx` portfolio |
| `/app/kogo` | `AppDetail.tsx` Kogo product |

## Build checklist

1. `npm run build` produces `dist/`.
2. `404.html` is copied from `index.html` for SPA fallback on GitHub Pages (`postbuild` script).

## Git discipline

After meaningful milestones, commit with clear messages so `git revert` or reset remains easy. Initial anchors: `chore: add project context and design docs`, then feature commits.

## Copy and i18n

All strings live in `src/i18n/messages.ts`. Optional **store links** for the Kogo detail page: set `VITE_KOGO_IOS_URL`, `VITE_KOGO_ANDROID_URL`, and optionally `VITE_KOGO_APP_VERSION` in `.env` (see `.env.example`). When unset, iOS/Android buttons still open the generic App Store and Play home pages; set full listing URLs for one-tap installs.
