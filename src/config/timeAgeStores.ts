/**
 * Time Age download links and latest version.
 *
 * Android and iOS builds ship as separate GitHub releases in
 * xiaowu95-dev/time_age_release, titled "TimeAge Android v..." / "TimeAge iOS v...".
 * Each release carries one installable asset (Android .apk, iOS .zip). The
 * store buttons resolve to the latest of each at runtime via the GitHub
 * releases API, so a new publish shows up without a site redeploy.
 *
 * Each platform exposes two download URLs: the github.com source and a mirror
 * (gh-proxy.org by default) for users where GitHub is slow/blocked.
 */
function trimEnv(value: string | undefined): string {
  return (value ?? '').trim()
}

const RELEASES_API = 'https://api.github.com/repos/xiaowu95-dev/time_age_release/releases'
export const TIME_AGE_RELEASES_URL = 'https://github.com/xiaowu95-dev/time_age_release/releases'

// China mirror prefix for GitHub release downloads. Override via env if a
// different proxy is preferred.
export const TIME_AGE_MIRROR_PREFIX =
  trimEnv(import.meta.env.VITE_TIME_AGE_MIRROR_PREFIX) || 'https://gh-proxy.org/'

export interface PlatformDownload {
  /** github.com direct asset URL */
  source: string
  /** mirror of the source URL (same URL when mirroring doesn't apply) */
  mirror: string
  /** resolved version, e.g. "1.4.4"; null while unresolved */
  version: string | null
}

export interface TimeAgeDownloads {
  android: PlatformDownload
  ios: PlatformDownload
}

export const TIME_AGE_DOWNLOAD_FALLBACK: TimeAgeDownloads = {
  android: { source: TIME_AGE_RELEASES_URL, mirror: TIME_AGE_RELEASES_URL, version: null },
  ios: { source: TIME_AGE_RELEASES_URL, mirror: TIME_AGE_RELEASES_URL, version: null },
}

interface GithubRelease {
  name: string | null
  tag_name: string
  published_at: string
  prerelease: boolean
  html_url: string
  assets: { name: string; browser_download_url: string }[]
}

/** "v1.4.4-20260730052831" -> "1.4.4" */
function versionFromTag(tag: string): string | null {
  const v = tag.replace(/^v/, '').split('-')[0]
  return v || null
}

/** Only proxy real release-asset URLs; leave the releases index unmirrored. */
function mirrorOf(url: string): string {
  if (!url.includes('/releases/download/')) return url
  const prefix = TIME_AGE_MIRROR_PREFIX.endsWith('/') ? TIME_AGE_MIRROR_PREFIX : `${TIME_AGE_MIRROR_PREFIX}/`
  return prefix + url
}

/**
 * Resolve the latest Android (.apk) and iOS (.zip) downloads + versions.
 * Falls back to the releases index on any error.
 *
 * ponytail: unauthenticated GitHub API is capped at 60 req/hr per IP.
 * Fine for a low-traffic product page; add a localStorage cache or a server
 * proxy if shared-IP traffic ever exhausts the budget.
 */
export async function resolveTimeAgeDownloads(): Promise<TimeAgeDownloads> {
  try {
    const res = await fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) throw new Error(`releases API returned ${res.status}`)
    const releases = (await res.json()) as GithubRelease[]

    // Sort newest-first explicitly — don't rely on the API's default ordering.
    // Tiebreak by tag_name (tags carry a UTC timestamp, so it's deterministic
    // even when two releases share the same published_at second).
    const sorted = [...releases].sort(
      (a, b) => b.published_at.localeCompare(a.published_at) || b.tag_name.localeCompare(a.tag_name),
    )

    const android = sorted.find((r) => r.name?.startsWith('TimeAge Android') && !r.prerelease)
    const ios = sorted.find((r) => r.name?.startsWith('TimeAge iOS') && !r.prerelease)

    const assetUrl = (r: GithubRelease | undefined, prefer: (a: { name: string }) => boolean) =>
      r?.assets.find(prefer)?.browser_download_url ?? r?.assets[0]?.browser_download_url ?? TIME_AGE_RELEASES_URL

    const androidUrl = assetUrl(android, (a) => a.name.endsWith('.apk'))
    const iosUrl = assetUrl(ios, (a) => a.name.endsWith('.zip'))

    return {
      android: { source: androidUrl, mirror: mirrorOf(androidUrl), version: versionFromTag(android?.tag_name ?? '') },
      ios: { source: iosUrl, mirror: mirrorOf(iosUrl), version: versionFromTag(ios?.tag_name ?? '') },
    }
  } catch {
    return TIME_AGE_DOWNLOAD_FALLBACK
  }
}
