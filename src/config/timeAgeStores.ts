/**
 * Time Age store URLs and marketed version.
 * Override with .env at build time, or edit defaults when listings go live.
 */
function trimEnv(value: string | undefined): string {
  return (value ?? '').trim()
}

export const TIME_AGE_APP_VERSION = trimEnv(import.meta.env.VITE_TIME_AGE_APP_VERSION) || '1.0.0'

export const TIME_AGE_IOS_STORE_URL =
  trimEnv(import.meta.env.VITE_TIME_AGE_IOS_URL) || 'https://apps.apple.com/'

export const TIME_AGE_ANDROID_STORE_URL =
  trimEnv(import.meta.env.VITE_TIME_AGE_ANDROID_URL) || 'https://play.google.com/store'
