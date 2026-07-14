# Home Redesign & Hash Router — Design Spec

**Date:** 2026-07-14
**Status:** Draft (pending approval)

## Goal

Restructure the home page to be personal-intro + software-overview (个人 + 软件总览), and migrate the router to Hash mode. Aligns with user requirements: beautiful/high-end, Hash router, separated home vs per-app copy, home about the person + apps.

## Scope

### In scope

1. **Router migration:** `BrowserRouter` → `HashRouter` in `src/main.tsx`.
2. **Home page rewrite:** New three-section editorial layout (结构 C 上下分区) in `src/pages/Home.tsx`.
3. **i18n restructure:** Separate home copy (personal + overview) from per-app detail copy in `src/i18n/messages.ts`.

### Out of scope (YAGNI)

- **Detail page deduplication.** `AppDetail.tsx` and `TimeAgeDetail.tsx` are near-clones but only 2 apps exist. Do not extract shared layout. Revisit when a 3rd app arrives.
- **Detail page visual changes.** Only Home + router + i18n change. Detail pages untouched except where they read i18n keys that moved.
- **New dependencies.** None added.
- **404.html build hack.** Stays as-is (harmless under HashRouter; serves as belt-and-suspenders fallback).

## Architecture

```
src/
├── main.tsx                    # MODIFY: BrowserRouter → HashRouter, drop basename
├── pages/
│   └── Home.tsx                # REWRITE: 3-section editorial layout
└── i18n/
    └── messages.ts             # MODIFY: restructure home.* keys, move app copy under apps.*
```

## 1. Router Migration

### File: `src/main.tsx`

**Before:**
```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <BrowserRouter basename={viteBasename()}>
      <App />
    </BrowserRouter>
  </I18nProvider>,
)
```

**After:**
```tsx
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </I18nProvider>,
)
```

**Notes:**
- Remove `viteBasename()` import if it becomes unused. Check all usages before deleting the helper; if `viteBasename` is only used here, remove the helper too.
- Routes in `App.tsx` (`/`, `/app/kogo`, `/app/time-age`) stay the same path strings — HashRouter prepends `#` automatically.
- Resulting URLs: `/#/`, `/#/app/kogo`, `/#/app/time-age`.
- `<Link to="/app/kogo">` continues to work unchanged.

### Cleanup check

After migration, verify:
- No remaining `BrowserRouter` or `basename` references.
- `viteBasename` helper in `src/lib/` — if unused, delete it (don't leave dead code).
- Build still produces `dist/index.html` + `dist/404.html`.

## 2. Home Page Rewrite

### File: `src/pages/Home.tsx`

Full rewrite to three-section editorial layout (结构 C). Keep existing imports where possible: `framer-motion`, `Link`, `useI18n`, `appDefs`.

### Layout

```
SiteHeader
─────────────────────────────────────
SECTION 1: Hero (personal)
  - portfolioLabel (small, gold, uppercase tracking)
  - heroName (large Playfair Display serif, "Xiaowu Dev")
  - heroTagline (one line, sans, muted)
  - large vertical whitespace
─────────────────────────────────────
SECTION 2: 作品总览 (software overview)
  - worksTitle (small serif heading)
  - worksCountLabel (e.g. "2 件作品" / "2 works")
  - Card grid (2 cols on desktop, 1 col mobile):
      For each appDef:
        - title (serif, large)
        - subtitle (one line, muted)  ← reused from apps.<id>.subtitle
        - cardOpenDetail link → /app/<slug>
─────────────────────────────────────
SECTION 3: 关于我 (about)
  - aboutTitle (small serif heading)
  - aboutBody (prose, max-w-readable)
  - githubLabel + githubUrl (gold link, external)
─────────────────────────────────────
SiteFooter
```

### Design tokens (from existing DESIGN.md / Tailwind config)

- Background: `bg-bg` (`#0a0a0a`) / section dividers via `border-gold/10` or whitespace only — no nested cards (per DESIGN.md rule).
- Hero name: `font-display text-5xl md:text-7xl text-text` (Playfair Display).
- Section headings: `font-display text-2xl text-gold`.
- Body: `font-sans text-text/70`, `max-w-readable` (72ch).
- Card link hover: `text-gold` transition, `border-b border-gold/0 hover:border-gold/40`.
- GitHub link: `text-gold underline-offset-4 hover:underline`.
- Motion: `framer-motion` fade-up on section enter, `ease-out`, stagger 0.08s. No bounce, no gradient text (per DESIGN.md).

### Card content source

Each card reads from `apps.<id>.title` and `apps.<id>.subtitle` — same keys detail pages use. No new copy needed for cards. `badge` not shown on home cards (kept minimal per "no icons, text-only" decision).

## 3. i18n Restructure

### File: `src/i18n/messages.ts`

**Remove** from `home.*`:
- `heroTitle: 'Kogo（コゴ）'` (was wrong — app name in personal hero)
- `heroBody` (Kogo-specific)
- `aboutBody` (Kogo-specific mention)

**Add** to `home.*`:

```ts
home: {
  portfolioLabel: '作品集',          // keep
  heroName: 'Xiaowu Dev',            // NEW (was heroTitle)
  heroTagline: '一名程序员，工作之余写代码、做小产品。',  // NEW
  worksTitle: '作品',                // NEW
  worksCountLabel: '{{count}} 件作品', // NEW, {{count}} interpolated
  aboutTitle: '关于我',              // keep
  aboutBody: '我是小武，一名普通的程序员。工作之外，我喜欢打磨一些小而完整的产品——做出来、用起来、再慢慢改。这里是我目前在做的几款应用，欢迎试用，也欢迎反馈。',  // NEW
  githubLabel: 'GitHub',             // NEW
  githubUrl: 'https://github.com/wang-xiaowu',  // NEW
  cardOpenDetail: '了解详情',        // keep
  cardStayTuned: '敬请期待',         // keep
}
```

English mirror:

```ts
home: {
  portfolioLabel: 'Portfolio',
  heroName: 'Xiaowu Dev',
  heroTagline: 'A developer writing code and small products after hours.',
  worksTitle: 'Work',
  worksCountLabel: '{{count}} works',
  aboutTitle: 'About',
  aboutBody: "I'm Xiaowu, a regular developer. Outside work, I like polishing small, complete products — build, use, then refine slowly. Below are the apps I'm working on. Try them and feedback is welcome.",
  githubLabel: 'GitHub',
  githubUrl: 'https://github.com/wang-xiaowu',
  cardOpenDetail: 'Learn more',
  cardStayTuned: 'Stay tuned',
}
```

**`apps.*` stays as-is** — already separated (`apps.kogo`, `apps.timeAge` with `title`/`subtitle`/`badge`). Detail page copy (`kogo.*`, `timeAge.*`) untouched.

### Interpolation

`worksCountLabel` uses `{{count}}`. The existing `getMessage` helper does not interpolate — check `I18nProvider`/`useI18n` for interpolation support. If absent, either:
- (a) Add `{{var}}` replacement in `getMessage`, or
- (b) Hardcode count in component (`'2 件作品'`) since count is known at build time.

**Decision:** Use (b) — hardcode in component. Count = `appDefs.length`. Avoids adding interpolation machinery for one use. If count changes, update is trivial. Document in code comment.

Actually — simpler: skip `worksCountLabel` key entirely. Render count inline in component:
```tsx
<span className="text-text/40 text-sm">{appDefs.length} 件作品</span>
```
But this hardcodes "件作品" zh-only. So keep `worksCountLabel` key, but interpolate in component:
```tsx
const label = t('home.worksCountLabel').replace('{{count}}', String(appDefs.length))
```
This uses simple string replace, no helper change needed. **Final decision: this approach.**

## 4. Copy Drafts (final-quality target)

### zh

- `heroName`: `Xiaowu Dev`
- `heroTagline`: `一名程序员，工作之余写代码、做小产品。`
- `worksTitle`: `作品`
- `worksCountLabel`: `{{count}} 件作品`
- `aboutTitle`: `关于我`
- `aboutBody`: `我是小武，一名普通的程序员。工作之外，我喜欢打磨一些小而完整的产品——做出来、用起来、再慢慢改。这里是我目前在做的几款应用，欢迎试用，也欢迎反馈。`
- `githubLabel`: `GitHub`
- `githubUrl`: `https://github.com/wang-xiaowu`

### en

- `heroName`: `Xiaowu Dev`
- `heroTagline`: `A developer writing code and small products after hours.`
- `worksTitle`: `Work`
- `worksCountLabel`: `{{count}} works`
- `aboutTitle`: `About`
- `aboutBody`: `I'm Xiaowu, a regular developer. Outside work, I like polishing small, complete products — build, use, then refine slowly. Below are the apps I'm working on. Try them and feedback is welcome.`
- `githubLabel`: `GitHub`
- `githubUrl`: `https://github.com/wang-xiaowu`

Voice notes: matches existing copy — first-person, modest, concrete, no marketing words. "小武" chosen to match brand "Xiaowu Dev" and provide a personal name in 关于我 section.

## 5. Verification

After implementation:

1. **Build:** `npm run build` passes (tsc + vite).
2. **Router:** Dev server loads `/#/` as home. Clicking app card navigates to `/#/app/kogo` and `/#/app/time-age`. Direct URL entry with hash works. Back button works.
3. **Home content:**
   - Hero shows "Xiaowu Dev" (not "Kogo（コゴ）").
   - Two app cards present with correct titles/subtitles.
   - GitHub link present in 关于我, href = `https://github.com/wang-xiaowu`, opens new tab.
4. **i18n:** Toggle zh/en, all new keys render in both locales. No `home.heroTitle` fallback path shown.
5. **Detail pages:** `/app/kogo` and `/app/time-age` still render fully (no broken i18n paths).
6. **Visual:** No console errors. Framer-motion animations play. No layout shift. Mobile responsive (1-col cards under `md`).

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Hash router breaks existing inbound links to `/app/kogo` | No external inbound links known (personal site, low traffic). Acceptable. |
| `viteBasename` helper left dead | Explicitly check usages and delete if unused. |
| Interpolation needs helper change | Avoided — use `.replace('{{count}}', ...)` inline. |
| Detail pages break if they read moved keys | Keys under `apps.*` and `kogo.*`/`timeAge.*` unchanged. Only `home.*` changes. Verify by grep. |
