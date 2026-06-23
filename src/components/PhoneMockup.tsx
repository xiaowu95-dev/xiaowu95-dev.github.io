import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { phoneCarouselImageUrls } from '@/lib/phoneCarouselImages'

type PhoneMockupProps = {
  className?: string
  images?: string[]
}

const AUTO_MS = 11_000
const swipeEase = [0.22, 1, 0.36, 1] as const

/**
 * Floating phone frame with gold-trimmed bezel; screen shows a screenshot carousel
 * when `public/bg*` assets exist, otherwise placeholder copy.
 */
export function PhoneMockup({ className = '', images }: PhoneMockupProps) {
  const { t } = useI18n()
  const slides = images ?? phoneCarouselImageUrls
  const [index, setIndex] = useState(0)
  const count = slides.length

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return
      setIndex((i) => (i + delta + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(() => go(1), AUTO_MS)
    return () => window.clearInterval(id)
  }, [count, go])

  return (
    <motion.div
      className={['relative mx-auto w-[min(100%,280px)]', className].join(' ')}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: swipeEase }}
    >
      <div
        className="absolute -inset-10 -z-10 rounded-[40px] opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, color-mix(in oklch, #d4af37 28%, transparent) 0%, transparent 65%)',
        }}
        aria-hidden
      />
      <div className="rounded-[2.5rem] bg-gradient-to-b from-gold-500/35 via-gold-700/15 to-gold-950/40 p-[2px] shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
        <div className="overflow-hidden rounded-[2.45rem] bg-gradient-to-b from-surface-muted to-surface-deep ring-1 ring-white/[0.04]">
          <div className="flex h-7 items-center justify-center bg-black/40">
            <div className="h-1.5 w-16 rounded-full bg-white/10" />
          </div>
          <div className="relative aspect-[9/19] bg-[#0c0c0c]">
            <div className="absolute inset-4 rounded-2xl border border-gold-500/25 bg-[#080808] overflow-hidden">
              {count > 0 ? (
                <>
                  <AnimatePresence initial={false} mode="sync">
                    <motion.img
                      key={slides[index]}
                      src={slides[index]}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: swipeEase }}
                      className="absolute inset-0 m-auto h-full w-full object-contain object-center"
                      draggable={false}
                    />
                  </AnimatePresence>

                  {count > 1 ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
                      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
                        {slides.map((_, i) => (
                          <span
                            key={`slide-dot-${i}`}
                            className={[
                              'h-1 rounded-full transition-[width,opacity] duration-300 ease-out',
                              i === index ? 'w-4 bg-gold-400/90 opacity-100' : 'w-1 bg-white/35 opacity-70',
                            ].join(' ')}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label={t('phone.carouselPrev')}
                        className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-gold-400 ring-1 ring-white/10 transition-opacity hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                      >
                        <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label={t('phone.carouselNext')}
                        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-gold-400 ring-1 ring-white/10 transition-opacity hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                      >
                        <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </button>
                    </>
                  ) : null}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="font-display text-lg text-[color:oklch(0.93_0.02_85)]">{t('phone.appLabel')}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-500/90">{t('phone.placeholder')}</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">{t('phone.hint')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
