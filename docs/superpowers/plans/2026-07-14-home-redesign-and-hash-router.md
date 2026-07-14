# Home Redesign & Hash Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate router to Hash mode and restructure the home page into personal-intro + software-overview sections, separating home copy from per-app detail copy.

**Architecture:** Two-file router swap (`BrowserRouter` → `HashRouter`, drop local `viteBasename` helper). One atomic i18n + Home rewrite: replace Kogo-centric `home.heroTitle`/`heroBody` with personal `heroName`/`heroTagline` + new `worksTitle`/`worksCountLabel`/`githubLabel`/`githubUrl`, and rewrite `Home.tsx` into a three-section editorial layout (Hero · 作品总览 · 关于我).

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion 12, Lucide React, React Router DOM v7

**Verification note:** No test framework in this project (`scripts: dev, build, lint, preview`). Verification per task = `npm run build` (tsc + vite) + dev-server smoke check. No new test dependencies added (YAGNI).

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/main.tsx` | Swap `BrowserRouter` → `HashRouter`, remove `viteBasename` helper |
| Modify | `src/i18n/messages.ts` | Restructure `home.*` keys (both zh and en locales) |
| Modify | `src/pages/Home.tsx` | Rewrite to three-section editorial layout |

No detail page files change — `AppDetail.tsx` / `TimeAgeDetail.tsx` read `kogo.*` / `timeAge.*` keys which are untouched.

---

### Task 1: Migrate router to Hash mode

**Files:**
- Modify: `src/main.tsx` (full rewrite, 22 lines)

- [ ] **Step 1: Rewrite main.tsx**

Replace the entire file with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { I18nProvider } from '@/i18n/I18nProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </HashRouter>
  </StrictMode>,
)
```

Changes vs current:
- `BrowserRouter` → `HashRouter` (from `react-router-dom`)
- Removed `viteBasename()` helper (lines 8-12) and its call — `HashRouter` does not use `basename` for GitHub Pages; the hash handles routing client-side regardless of `BASE_URL`.
- Removed now-unused `import.meta.env.BASE_URL` reference (was only inside `viteBasename`).

- [ ] **Step 2: Verify no other `viteBasename` references exist**

Run: `grep -rn "viteBasename" src/`
Expected: no output (helper was local to main.tsx, no other callers).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: tsc + vite complete, `dist/index.html` and `dist/404.html` produced, no errors.

- [ ] **Step 4: Smoke check router**

Run: `npm run preview` (or `npm run dev` in a separate terminal)
Open browser to the dev URL. Verify:
- Home loads at `/#/` (URL bar shows hash).
- Navigate to an app card → URL becomes `/#/app/kogo` or `/#/app/time-age`, detail page renders.
- Browser back button returns to `/#/`.
- Refresh on `/#/app/kogo` → page reloads correctly (HashRouter handles this natively; no 404 fallback needed).

Stop the preview server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/main.tsx
git commit -m "feat(router): migrate BrowserRouter to HashRouter for static hosting"
```

---

### Task 2: Restructure i18n home keys + rewrite Home page

This task is atomic: i18n key changes and Home.tsx rewrite land in one commit, so the site is never in a broken intermediate state (no orphaned key reads).

**Files:**
- Modify: `src/i18n/messages.ts` (lines 37-48 zh `home` block, lines 139-150 en `home` block)
- Modify: `src/pages/Home.tsx` (full rewrite, 139 lines)

- [ ] **Step 1: Replace zh `home` block in messages.ts**

Find the zh `home` block (currently lines 37-48):

```ts
    home: {
      portfolioLabel: '作品集',
      heroTitle: 'Kogo（コゴ）',
      heroBody:
        '教材式学习、间隔复习与 JLPT 练习在同一路径里，适合每天稳步向前的人。',
      aboutTitle: '关于我',
      aboutBody:
        '我是一名普通的程序员，工作之余写代码、做一点小产品。Kogo 是我在打磨的日语学习应用，欢迎试用和反馈。',
      cardView: '查看',
      cardOpenDetail: '了解详情',
      cardStayTuned: '敬请期待',
    },
```

Replace with:

```ts
    home: {
      portfolioLabel: '作品集',
      heroName: 'Xiaowu Dev',
      heroTagline: '一名程序员，工作之余写代码、做小产品。',
      worksTitle: '作品',
      worksCountLabel: '{{count}} 件作品',
      aboutTitle: '关于我',
      aboutBody:
        '我是小武，一名普通的程序员。工作之外，我喜欢打磨一些小而完整的产品——做出来、用起来、再慢慢改。这里是我目前在做的几款应用，欢迎试用，也欢迎反馈。',
      githubLabel: 'GitHub',
      githubUrl: 'https://github.com/wang-xiaowu',
      cardOpenDetail: '了解详情',
      cardStayTuned: '敬请期待',
    },
```

Removed: `heroTitle`, `heroBody` (old), `cardView` (no longer rendered — cards show `cardOpenDetail` only).
Added: `heroName`, `heroTagline`, `worksTitle`, `worksCountLabel`, `githubLabel`, `githubUrl`, new `aboutBody`.

- [ ] **Step 2: Replace en `home` block in messages.ts**

Find the en `home` block (currently lines 139-150):

```ts
    home: {
      portfolioLabel: 'Portfolio',
      heroTitle: 'Kogo（コゴ）',
      heroBody:
        'Textbook-style lessons, spaced review, and JLPT drills share one path for people who want steady daily progress. Below is the product and a short note about me.',
      aboutTitle: 'About',
      aboutBody:
        'I am a regular developer. I write code and side projects after work. Kogo is the Japanese study app I am building and polishing, feedback is welcome.',
      cardView: 'View',
      cardOpenDetail: 'Learn more',
      cardStayTuned: 'Stay tuned',
    },
```

Replace with:

```ts
    home: {
      portfolioLabel: 'Portfolio',
      heroName: 'Xiaowu Dev',
      heroTagline: 'A developer writing code and small products after hours.',
      worksTitle: 'Work',
      worksCountLabel: '{{count}} works',
      aboutTitle: 'About',
      aboutBody:
        "I'm Xiaowu, a regular developer. Outside work, I like polishing small, complete products — build, use, then refine slowly. Below are the apps I'm working on. Try them and feedback is welcome.",
      githubLabel: 'GitHub',
      githubUrl: 'https://github.com/wang-xiaowu',
      cardOpenDetail: 'Learn more',
      cardStayTuned: 'Stay tuned',
    },
```

- [ ] **Step 3: Verify zh/en key sets match**

Both locales' `home` blocks must have identical key sets. After edits, both should contain exactly:
`portfolioLabel, heroName, heroTagline, worksTitle, worksCountLabel, aboutTitle, aboutBody, githubLabel, githubUrl, cardOpenDetail, cardStayTuned` (11 keys).

- [ ] **Step 4: Rewrite Home.tsx**

Replace the entire file with:

```tsx
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { useI18n } from '@/i18n/useI18n'

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const appDefs = [
  { id: 'kogo' as const, slug: '/app/kogo' },
  { id: 'timeAge' as const, slug: '/app/time-age' },
]

export default function Home() {
  const { t } = useI18n()
  const worksCount = t('home.worksCountLabel').replace(
    '{{count}}',
    String(appDefs.length),
  )

  return (
    <div className="gold-ambient flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        {/* Section 1: Hero (personal) */}
        <section className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-24 sm:px-8 sm:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500/90">
                {t('home.portfolioLabel')}
              </p>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-[color:oklch(0.95_0.015_85)] sm:text-7xl">
                {t('home.heroName')}
              </h1>
              <p className="mt-6 max-w-readable text-base leading-relaxed text-gray-400">
                {t('home.heroTagline')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 2: 作品总览 (software overview) */}
        <section className="border-t border-white/[0.05] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-2xl text-gold-500 sm:text-3xl">
                  {t('home.worksTitle')}
                </h2>
                <span className="text-sm text-gray-500">{worksCount}</span>
              </div>

              <motion.ul
                variants={stagger}
                initial="hidden"
                animate="show"
                className="mt-12 grid w-full gap-6 sm:grid-cols-2"
              >
                {appDefs.map((app) => {
                  const title = t(`apps.${app.id}.title`)
                  const subtitle = t(`apps.${app.id}.subtitle`)

                  return (
                    <motion.li key={app.id} variants={rise} className="h-full">
                      <Link
                        to={app.slug}
                        className="group block h-full rounded-2xl border border-gold-500/20 bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-gold-400/55 hover:shadow-[0_28px_100px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                      >
                        <h3 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)]">
                          {title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                          {subtitle}
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gold-500">
                          <span>{t('home.cardOpenDetail')}</span>
                          <ArrowUpRight
                            className="h-4 w-4"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                        </div>
                      </Link>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Section 3: 关于我 (about) */}
        <section
          id="about"
          className="mt-auto border-t border-white/[0.05] bg-black/20 py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <h2 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)] sm:text-3xl">
                {t('home.aboutTitle')}
              </h2>
              <p className="mt-4 max-w-readable leading-relaxed text-gray-400">
                {t('home.aboutBody')}
              </p>
              <a
                href={t('home.githubUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-500 underline-offset-4 hover:underline"
              >
                {t('home.githubLabel')}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
```

Key changes vs current Home.tsx:
- `appDefs`: removed `featured` field (unused after dropping badge rendering).
- Section 1 (Hero): renders `home.heroName` (was `heroTitle`) + `home.heroTagline` (was `heroBody`). Larger type (`text-5xl sm:text-7xl` vs `text-4xl sm:text-5xl`) and more top padding (`pt-24 sm:pt-32` vs `pt-16 sm:pt-20`) for editorial whitespace.
- Section 2 (作品): new section between hero and about. Renders `worksTitle` + `worksCountLabel` (with `{{count}}` replaced via `.replace()`) and a 2-col card grid (`sm:grid-cols-2`). Cards show only `title` + `subtitle` + `cardOpenDetail` link — no badge (per spec decision).
- Section 3 (关于我): same about prose structure, plus GitHub external link with `target="_blank" rel="noopener noreferrer"`.
- Removed: `cardView` rendering (key removed from i18n), `featured` badge pill.
- Preserved: `gold-ambient` root, `stagger`/`rise` motion variants, motion easing curves, focus-visible outline, card hover lift.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: tsc + vite complete with no errors. No "unused variable" warnings (verify `featured` removal didn't leave orphans — none should exist since it was only in `appDefs`).

- [ ] **Step 6: Smoke check Home content**

Run: `npm run preview`
Open browser. Verify:
- Hero shows "Xiaowu Dev" (NOT "Kogo（コゴ）").
- Hero tagline renders below name.
- 作品 section heading visible with count ("2 件作品" in zh).
- Two app cards render with correct titles ("Kogo（コゴ）" / "时光 Age") and subtitles.
- Cards link to `/#/app/kogo` and `/#/app/time-age`.
- 关于我 section shows new prose + GitHub link.
- GitHub link opens `https://github.com/wang-xiaowu` in new tab.
- Toggle locale (zh ↔ en) — all new keys render in both languages. No literal path strings like `home.heroName` appearing anywhere.

- [ ] **Step 7: Smoke check detail pages unchanged**

While preview is running, navigate to `/#/app/kogo` and `/#/app/time-age`. Verify both detail pages render fully (hero + features + store buttons + phone mockup). No broken i18n paths. This confirms the i18n restructure didn't break detail pages (they read `kogo.*` / `timeAge.*`, untouched).

Stop preview server.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/messages.ts src/pages/Home.tsx
git commit -m "feat(home): editorial 3-section layout, personal hero + works + about

- Replace Kogo-centric hero with personal Xiaowu Dev hero
- Add 作品总览 section with 2-col card grid (no badges)
- Add GitHub link to 关于我 section
- Restructure i18n home.* keys (zh + en), remove heroTitle/heroBody/cardView"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|------------------|------|
| Router → Hash mode | Task 1 |
| `BrowserRouter` removed, `viteBasename` deleted | Task 1 Step 1-2 |
| Home 3-section structure (Hero · 作品 · 关于我) | Task 2 Step 4 |
| Hero shows personal name (Xiaowu Dev) | Task 2 Step 4 (Hero section) |
| 作品总览 with count + 2 text-only cards | Task 2 Step 4 (Section 2) |
| 关于我 with prose + GitHub link | Task 2 Step 4 (Section 3) |
| i18n home.* restructured (zh + en) | Task 2 Step 1-2 |
| `heroTitle`/`heroBody`/`cardView` removed | Task 2 Step 1-2 |
| New keys: `heroName`/`heroTagline`/`worksTitle`/`worksCountLabel`/`githubLabel`/`githubUrl`/new `aboutBody` | Task 2 Step 1-2 |
| `worksCountLabel` interpolation via `.replace()` | Task 2 Step 4 (`worksCount` const) |
| GitHub URL = `https://github.com/wang-xiaowu`, new tab | Task 2 Step 4 (`<a target="_blank">`) |
| Detail pages untouched | Task 2 Step 7 verifies |
| No new dependencies | Confirmed — only existing `react-router-dom` HashRouter used |

All spec requirements covered. ✓

### Placeholder scan

No TBD / TODO / "implement later" / "add error handling" / "similar to Task N". All code blocks contain final code. ✓

### Type consistency

- `appDefs` items: `{ id: 'kogo' | 'timeAge', slug: string }` — `id` used in `t(\`apps.${app.id}.title\`)`, `slug` used in `<Link to={app.slug}>`. Both usages match.
- `useI18n()` returns `{ t }` — confirmed from `src/i18n/I18nProvider.tsx` line 19, 26.
- `t(path: string): string` — confirmed from `getMessage` return type. `.replace()` on its return is valid.
- i18n key names match between Task 2 Step 1-2 (definitions) and Step 4 (usages): `portfolioLabel`, `heroName`, `heroTagline`, `worksTitle`, `worksCountLabel`, `aboutTitle`, `aboutBody`, `githubLabel`, `githubUrl`, `cardOpenDetail`. All 11 keys defined in both locales, all referenced in Home.tsx. ✓
- `apps.<id>.title` / `apps.<id>.subtitle` — pre-existing keys, unchanged. ✓

No inconsistencies. ✓

### Scope check

Single subsystem (portfolio site home + router). No multi-system split needed. ✓
