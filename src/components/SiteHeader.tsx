import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import type { Locale } from '@/i18n/messages'

export function SiteHeader() {
  const { locale, setLocale, t } = useI18n()

  return (
    <header className="border-b border-white/[0.06] bg-surface-deep/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-[color:oklch(0.94_0.02_85)] transition-colors group-hover:text-gold-500">
            {t('nav.brand')}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-gray-500 sm:inline">
            {t('nav.appsTag')}
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  'transition-colors hover:text-gold-400',
                  isActive ? 'text-gold-500' : '',
                ].join(' ')
              }
              end
            >
              {t('nav.work')}
            </NavLink>
            <a
              href="#about"
              className="transition-colors hover:text-gold-400"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {t('nav.about')}
            </a>
          </nav>
          <LanguageToggle locale={locale} setLocale={setLocale} t={t} />
        </div>
      </div>
    </header>
  )
}

function LanguageToggle({
  locale,
  setLocale,
  t,
}: {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (path: string) => string
}) {
  const btn =
    'rounded-full px-3 py-1.5 text-xs font-semibold transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500'

  return (
    <div
      className="flex items-center rounded-full border border-gold-500/25 bg-black/45 p-0.5"
      role="group"
      aria-label={t('nav.langAria')}
    >
      <button
        type="button"
        className={`${btn} ${locale === 'zh' ? 'bg-gold-500/20 text-gold-400' : 'text-gray-500 hover:text-gray-300'}`}
        aria-pressed={locale === 'zh'}
        onClick={() => setLocale('zh')}
      >
        {t('nav.langZh')}
      </button>
      <button
        type="button"
        className={`${btn} ${locale === 'en' ? 'bg-gold-500/20 text-gold-400' : 'text-gray-500 hover:text-gray-300'}`}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        {t('nav.langEn')}
      </button>
    </div>
  )
}
