import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

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

const apps = [
  {
    slug: '/app/jlpt',
    title: 'JLPT: Japanese Mastery',
    subtitle: 'SRS, exams, and a calm study rhythm.',
    badge: 'Flagship',
    featured: true,
  },
  {
    slug: '#',
    title: 'Kanji Trace Lab',
    subtitle: 'Handwriting drills with pressure-aware strokes.',
    badge: 'In lab',
    featured: false,
  },
  {
    slug: '#',
    title: 'Listening Lounge',
    subtitle: 'Curated audio paths for N3–N1.',
    badge: 'Soon',
    featured: false,
  },
]

export default function Home() {
  return (
    <div className="gold-ambient flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:px-8 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500/90">
              Portfolio
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-[color:oklch(0.95_0.015_85)] sm:text-5xl">
              Apps built for deliberate Japanese study.
            </h1>
            <p className="mt-5 max-w-readable text-base leading-relaxed text-gray-400">
              A quiet grid of tools I design and ship. Each keeps complexity low, respects your time,
              and leans into craft over noise.
            </p>
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {apps.map((app) => {
              const CardInner = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/85">
                        {app.badge}
                      </p>
                      <h2 className="mt-3 font-display text-2xl text-[color:oklch(0.94_0.015_85)]">
                        {app.title}
                      </h2>
                    </div>
                    {app.featured ? (
                      <span className="rounded-full border border-gold-500/35 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-400">
                        View
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">{app.subtitle}</p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gold-500">
                    <span>{app.slug === '#' ? 'Stay tuned' : 'Open detail'}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </div>
                </>
              )

              const cardClass =
                'group block rounded-2xl border border-gold-500/20 bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-gold-400/55 hover:shadow-[0_28px_100px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500'

              if (app.slug === '#') {
                return (
                  <motion.li key={app.title} variants={rise} className="h-full">
                    <div className={`${cardClass} pointer-events-none opacity-75`}>{CardInner}</div>
                  </motion.li>
                )
              }

              return (
                <motion.li key={app.title} variants={rise} className="h-full">
                  <Link to={app.slug} className={cardClass}>
                    {CardInner}
                  </Link>
                </motion.li>
              )
            })}
          </motion.ul>
        </section>

        <section id="about" className="border-t border-white/[0.05] bg-black/20 py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-readable"
            >
              <h2 className="font-display text-2xl text-[color:oklch(0.94_0.015_85)] sm:text-3xl">
                About
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                I build study products that feel like a good edition on a shelf: confident typography,
                generous space, and no clutter. Replace this copy with your bio, awards, or contact
                preferences.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}