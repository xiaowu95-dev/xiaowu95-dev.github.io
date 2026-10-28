/**
 * Time Age download links (static).
 *
 * ponytail: versions are hardcoded — bump these when publishing a release,
 * or reintroduce the GitHub releases API lookup if staleness hurts.
 */
export const TIME_AGE_RELEASES_URL = 'https://github.com/xiaowu95-dev/time_age_release/releases'

// Android ships via Google Play; iOS still via GitHub release assets.
export const TIME_AGE_ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.timeage.app'

export interface PlatformDownload {
  source: string
  version: string
}

export const TIME_AGE_DOWNLOADS: { android: PlatformDownload; ios: PlatformDownload } = {
  android: { source: TIME_AGE_RELEASES_URL, version: '1.4.5' },
  ios: { source: TIME_AGE_RELEASES_URL, version: '1.4.4' },
}
