import { motion } from 'framer-motion'
import { ArrowUpDown, Palette, Settings2, Users } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneMockup } from '@/components/PhoneMockup'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TIME_AGE_ANDROID_STORE_URL, TIME_AGE_APP_VERSION, TIME_AGE_IOS_STORE_URL } from '@/config/timeAgeStores'
import { getMessage } from '@/i18n/messages'
import { useI18n } from '@/i18n/useI18n'
import { timeAgeImageUrls } from '@/lib/timeAgeImages'

const featureDefs = [
  { id: 'track' as const, icon: ArrowUpDown },
  { id: 'precision' as const, icon: Settings2 },
  { id: 'gradient' as const, icon: Palette },
  { id: 'group' as const, icon: Users },
]

const FEATURE_KEYS: Record<(typeof featureDefs)[number]['id'], readonly [string, string]> = {
  track: ['timeAge.feature1Title', 'timeAge.feature1Body'],
  precision: ['timeAge.feature2Title', 'timeAge.feature2Body'],
  gradient: ['timeAge.feature3Title', 'timeAge.feature3Body'],
  group: ['timeAge.feature4Title', 'timeAge.feature4Body'],
}

const sectionEase = [0.22, 1, 0.36, 1] as const

const storeBtnClass =
  'inline-flex h-auto min-h-12 flex-col items-start justify-center gap-0.5 rounded-full border border-gold-500/35 bg-[#0c0c0c] px-7 py-3.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:border-gold-400/60 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500'

function formatVersionLine(t: (key: string) => string, key: string, version: string) {
  return t(key).replace(/\{\{v\}\}/g, version)
}

export default function TimeAgeDetail() {
  const { locale, t } = useI18n()

  useEffect(() => {
    document.title = t('timeAge.pageTitle')
    return () => {
      document.title = getMessage(locale, 'documentTitle')
    }
  }, [locale, t])

  return (
    <div className="gold-ambient flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 sm:pt-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: sectionEase }}
            className="text-sm text-gray-500"
          >
            <Link to="/" className="text-gold-500/90 transition-colors hover:text-gold-400">
              {t('timeAge.back')}
            </Link>
          </motion.p>

          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: sectionEase, delay: 0.05 }}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500/90"
              >
                {t('timeAge.rangeTag')}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.1 }}
                className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-[color:oklch(0.95_0.015_85)] sm:text-5xl lg:text-[3.15rem]"
              >
                {t('timeAge.heroName')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.14 }}
                className="mt-8 max-w-readable font-display text-xl font-medium leading-snug text-[color:oklch(0.94_0.02_85)] sm:text-2xl"
              >
                {t('timeAge.sloganMain')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.18 }}
                className="mt-2 max-w-readable text-base leading-relaxed text-gold-500/95 sm:text-lg"
              >
                {t('timeAge.sloganSub')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.21 }}
                className="mt-4 max-w-readable text-sm leading-relaxed text-gray-500"
              >
                {t('timeAge.sloganHint')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: sectionEase, delay: 0.26 }}
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <a
                  href={TIME_AGE_IOS_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={storeBtnClass}
                >
                  <span className="text-sm font-semibold text-[color:oklch(0.93_0.02_85)]">
                    {t('timeAge.storeIosTitle')}
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    {formatVersionLine(t, 'timeAge.storeIosVersion', TIME_AGE_APP_VERSION)}
                  </span>
                </a>
                <a
                  href={TIME_AGE_ANDROID_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={storeBtnClass}
                >
                  <span className="text-sm font-semibold text-[color:oklch(0.93_0.02_85)]">
                    {t('timeAge.storeAndroidTitle')}
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    {formatVersionLine(t, 'timeAge.storeAndroidVersion', TIME_AGE_APP_VERSION)}
                  </span>
                </a>
              </motion.div>
            </div>

            <PhoneMockup className="lg:justify-self-end" images={timeAgeImageUrls} />
          </div>
        </section>

        <section className="border-t border-white/[0.05] bg-black/15 py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.55, ease: sectionEase }}
              className="max-w-xl"
            >
              <h2 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)] sm:text-3xl">
                {t('timeAge.featuresHeading')}
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">{t('timeAge.featuresSub')}</p>
            </motion.div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {featureDefs.map((f, i) => {
                const Icon = f.icon
                const [titleKey, bodyKey] = FEATURE_KEYS[f.id]

                return (
                  <motion.article
                    key={f.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, ease: sectionEase, delay: i * 0.06 }}
                    className="rounded-2xl border border-white/[0.07] bg-surface/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/40 bg-black/35 text-gold-500">
                      <Icon className="h-5 w-5" strokeWidth={1.35} aria-hidden />
                    </div>
                    <h3 className="mt-6 font-display text-xl text-[color:oklch(0.94_0.015_85)]">
                      {t(titleKey)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{t(bodyKey)}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
