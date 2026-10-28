import type { Locale } from '@/i18n/messages'

/**
 * App screenshot files in `public/images/<app>/<locale>/`.
 * Add an image by dropping the file into the locale dirs and appending the
 * filename to the app's list here (order = carousel order).
 */
const FILES = {
  kogo: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'],
  time_age: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
} as const

export type AppSlug = keyof typeof FILES

export function appImageUrls(app: AppSlug, locale: Locale): string[] {
  return FILES[app].map((name) => `${import.meta.env.BASE_URL}images/${app}/${locale}/${name}`)
}
