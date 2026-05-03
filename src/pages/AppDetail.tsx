import { motion } from 'framer-motion'
import { Brain, Crown, Library, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PhoneMockup } from '@/components/PhoneMockup'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

const features = [
  {
    title: 'Intelligent forgetting curve',
    body: 'Scheduling that respects how your memory actually ages across JLPT levels.',
    icon: Brain,
  },
  {
    title: 'Past papers, present focus',
    body: 'Full-length exam shells with timing, so the room feels familiar before test day.',
    icon: Library,
  },
  {
    title: 'Black-gold immersion',
    body: 'A dim, calm interface that keeps evenings soft when you study late.',
    icon: Crown,
  },
  {
    title: 'Rhythm-aware sessions',
    body: 'Short bursts or deep runs; timers stay out of the way until you need them.',
    icon: Timer,
  },
]

const sectionEase = [0.22, 1, 0.36, 1] as const

export default function AppDetail() {
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
              ← All apps
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
                JLPT / N5–N1
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.1 }}
                className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-[color:oklch(0.95_0.015_85)] sm:text-5xl lg:text-[3.15rem]"
              >
                Yukō <span className="text-gold-500">優光</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: sectionEase, delay: 0.16 }}
                className="mt-5 max-w-readable text-lg leading-relaxed text-gray-400 sm:text-xl"
              >
                Master JLPT with elegance. One composed session after another, backed by structure you
                can trust.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: sectionEase, delay: 0.22 }}
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="https://apps.apple.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gold-500/35 bg-[#0c0c0c] px-8 text-sm font-semibold text-[color:oklch(0.93_0.02_85)] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:border-gold-400/60 hover:brightness-110"
                >
                  App Store
                </a>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gold-500/35 bg-[#0c0c0c] px-8 text-sm font-semibold text-[color:oklch(0.93_0.02_85)] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:border-gold-400/60 hover:brightness-110"
                >
                  Google Play
                </a>
              </motion.div>
            </div>

            <PhoneMockup className="lg:justify-self-end" />
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
                Built around four quiet promises
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Each pillar keeps the product honest: memory science, exam fidelity, atmosphere, and
                time kept sacred.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.article
                    key={f.title}
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
                      {f.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{f.body}</p>
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
