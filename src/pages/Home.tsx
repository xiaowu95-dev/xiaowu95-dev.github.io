import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { useI18n } from '@/i18n/useI18n'

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const appDefs = [
  { id: 'kogo' as const, slug: '/app/kogo' },
  { id: 'timeAge' as const, slug: '/app/time-age' },
]

export default function Home() {
  const { t } = useI18n()
  const worksCount = t('home.worksCountLabel').replace(
    '{{count}}',
    String(appDefs.length),
  )

  return (
    <div className="gold-ambient flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        {/* Section 1: Hero (personal) */}
        <section className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-24 sm:px-8 sm:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500/90">
                {t('home.portfolioLabel')}
              </p>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-[color:oklch(0.95_0.015_85)] sm:text-7xl">
                {t('home.heroName')}
              </h1>
              <p className="mt-6 max-w-readable text-base leading-relaxed text-gray-400">
                {t('home.heroTagline')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 2: 作品总览 (software overview) */}
        <section className="border-t border-white/[0.05] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-2xl text-gold-500 sm:text-3xl">
                  {t('home.worksTitle')}
                </h2>
                <span className="text-sm text-gray-500">{worksCount}</span>
              </div>

              <motion.ul
                variants={stagger}
                initial="hidden"
                animate="show"
                className="mt-12 grid w-full gap-6 sm:grid-cols-2"
              >
                {appDefs.map((app) => {
                  const title = t(`apps.${app.id}.title`)
                  const subtitle = t(`apps.${app.id}.subtitle`)

                  return (
                    <motion.li key={app.id} variants={rise} className="h-full">
                      <Link
                        to={app.slug}
                        className="group block h-full rounded-2xl border border-gold-500/20 bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-gold-400/55 hover:shadow-[0_28px_100px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                      >
                        <h3 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)]">
                          {title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                          {subtitle}
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gold-500">
                          <span>{t('home.cardOpenDetail')}</span>
                          <ArrowUpRight
                            className="h-4 w-4"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                        </div>
                      </Link>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Section 3: 关于我 (about) */}
        <section
          id="about"
          className="mt-auto border-t border-white/[0.05] bg-black/20 py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <h2 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)] sm:text-3xl">
                {t('home.aboutTitle')}
              </h2>
              <p className="mt-4 max-w-readable leading-relaxed text-gray-400">
                {t('home.aboutBody')}
              </p>
              <a
                href={t('home.githubUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-500 underline-offset-4 hover:underline"
              >
                {t('home.githubLabel')}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
