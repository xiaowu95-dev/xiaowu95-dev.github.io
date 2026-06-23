/**
 * Time Age screenshot files in `public/` for the phone carousel.
 * When you add `public/time_age5.png` etc., append the filename here.
 */
const TA_FILES = ['time_age1.png', 'time_age2.png', 'time_age3.png', 'time_age4.png'] as const

export const timeAgeImageUrls: string[] = TA_FILES.map(
  (name) => `${import.meta.env.BASE_URL}${name}`,
)
