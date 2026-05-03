# Design tokens

## Scene

Learner opens the site on a phone in a quiet space with warm, low ambient light. The UI stays deep and matte so gold reads as metal and craft, not nightclub neon.

## Color strategy

**Restrained** with one committed gold accent: background stack near `#0a0a0a` / `#141414`, text around `gray-300`, accent gold `#D4AF37` and bridge `#C5A021`. Neutrals are warm-tinted, never pure `#000` / `#fff` as large fields.

## Typography

- **Display / headlines:** Playfair Display (serif).
- **UI / body:** DM Sans (sans). Scale jumps ≥1.25 between levels; body max width ~65ch where prose blocks exist.

## Motion

Ease-out curves (cubic-bezier approx. quart/quint). No bounce. Prefer opacity + translate for scroll reveals (Framer Motion).

## Components

- Primary buttons: near-black fill, gold border or subtle gold-tinted hover; optional horizontal gold gradient as **background** on CTA (not gradient text).
- Cards: full border, gold at low alpha; hover lift 2–4px and brighter border.
- Icons: Lucide, stroke-first, gold `currentColor`, avoid heavy fills.

## Bans (project-specific)

- No gradient clipped text.
- No colored side-stripe accents on cards or lists.
- No nested “card inside card” except phone chrome as single device frame.
