/**
 * Screenshot files in `public/` whose names start with `bg` (served at site root).
 * When you add `public/bg5.png` etc., append the filename here (sorted order for the carousel).
 */
const BG_FILES = ['bg1.png', 'bg2.png', 'bg3.png', 'bg4.png'] as const

export const phoneCarouselImageUrls: string[] = BG_FILES.map(
  (name) => `${import.meta.env.BASE_URL}${name}`,
)
