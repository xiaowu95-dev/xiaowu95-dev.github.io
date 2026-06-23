/**
 * Time Age screenshot files in `public/` for the phone carousel.
 * Add `public/ta1.png` etc., then append filenames here.
 * Currently empty — placeholder text will show until screenshots are added.
 */
const TA_FILES: string[] = []

export const timeAgeImageUrls: string[] = TA_FILES.map(
  (name) => `${import.meta.env.BASE_URL}${name}`,
)
