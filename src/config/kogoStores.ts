/**
 * Kogo store URLs and marketed version.
 * Override with .env at build time, or edit defaults when listings go live.
 * Version should match `expo.version` in jap_study_new2/app.json when you cut a release.
 */
function trimEnv(value: string | undefined): string {
  return (value ?? '').trim()
}

export const KOGO_APP_VERSION = trimEnv(import.meta.env.VITE_KOGO_APP_VERSION) || '1.0.0'

export const KOGO_IOS_STORE_URL =
  trimEnv(import.meta.env.VITE_KOGO_IOS_URL) || 'https://apps.apple.com/'

export const KOGO_ANDROID_STORE_URL =
  trimEnv(import.meta.env.VITE_KOGO_ANDROID_URL) || 'https://play.google.com/store'
