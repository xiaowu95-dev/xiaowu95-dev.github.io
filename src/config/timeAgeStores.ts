/**
 * Time Age download URLs and marketed version.
 *
 * Android and iOS builds ship as separate GitHub releases in
 * xiaowu95-dev/time_age_release, titled "TimeAge Android v..." / "TimeAge iOS v...".
 * The store buttons resolve to the latest of each at runtime via the GitHub
 * releases API, so a new publish shows up without a site redeploy.
 */
function trimEnv(value: string | undefined): string {
  return (value ?? '').trim()
}

export const TIME_AGE_APP_VERSION = trimEnv(import.meta.env.VITE_TIME_AGE_APP_VERSION) || '1.0.0'

const RELEASES_API = 'https://api.github.com/repos/xiaowu95-dev/time_age_release/releases'
export const TIME_AGE_RELEASES_URL = 'https://github.com/xiaowu95-dev/time_age_release/releases'

interface GithubRelease {
  name: string | null
  html_url: string
  assets: { name: string; browser_download_url: string }[]
}

/**
 * Resolve the latest Android (.apk direct download) and iOS (release page)
 * URLs. Falls back to the releases index on any error.
 *
 * ponytail: unauthenticated GitHub API is capped at 60 req/hr per IP.
 * Fine for a low-traffic product page; add a localStorage cache or a server
 * proxy if shared-IP traffic ever exhausts the budget.
 */
export async function resolveTimeAgeDownloadUrls(): Promise<{ ios: string; android: string }> {
  try {
    const res = await fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) throw new Error(`releases API returned ${res.status}`)
    const releases = (await res.json()) as GithubRelease[]

    const android = releases.find((r) => r.name?.startsWith('TimeAge Android'))
    const ios = releases.find((r) => r.name?.startsWith('TimeAge iOS'))
    const androidApk = android?.assets.find((a) => a.name.endsWith('.apk'))

    return {
      android: androidApk?.browser_download_url ?? android?.html_url ?? TIME_AGE_RELEASES_URL,
      // iOS can't sideload from a web asset; the release page is the right target.
      ios: ios?.html_url ?? TIME_AGE_RELEASES_URL,
    }
  } catch {
    return { android: TIME_AGE_RELEASES_URL, ios: TIME_AGE_RELEASES_URL }
  }
}
