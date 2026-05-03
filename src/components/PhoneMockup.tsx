import { motion } from 'framer-motion'
import { useI18n } from '@/i18n/useI18n'

type PhoneMockupProps = {
  className?: string
}

/**
 * Floating phone frame with placeholder screen and gold-trimmed bezel.
 */
export function PhoneMockup({ className = '' }: PhoneMockupProps) {
  const { t } = useI18n()

  return (
    <motion.div
      className={['relative mx-auto w-[min(100%,280px)]', className].join(' ')}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
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
            <div className="absolute inset-4 rounded-2xl border border-gold-500/25 bg-gradient-to-br from-surface to-surface-deep" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="font-display text-lg text-[color:oklch(0.93_0.02_85)]">{t('phone.appLabel')}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-500/90">{t('phone.placeholder')}</p>
              <p className="text-[11px] leading-relaxed text-gray-500">{t('phone.hint')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
