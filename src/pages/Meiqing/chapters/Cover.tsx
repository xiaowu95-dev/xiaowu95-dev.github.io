import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StarField from '../components/StarField'
import FloatingParticles from '../components/FloatingParticles'

interface CoverProps {
  onNext: () => void
  onContentReady?: () => void
}

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.5 + i * 0.8,
      duration: 1.4,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  }),
}

export default function Cover(_props: CoverProps) {
  useEffect(() => { _props.onContentReady?.() }, [_props.onContentReady])
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
      style={{ background: 'oklch(0.06 0.012 270)' }}
    >
      <StarField count={200} />
      <FloatingParticles count={20} color="oklch(0.82 0.04 85)" speed={0.2} />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 60%, oklch(0.20 0.055 295 / 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Main quote */}
        <motion.p
          className="meqing-quote max-w-lg"
          style={{ color: 'oklch(0.94 0.015 80)' }}
          custom={0}
          variants={textReveal}
          initial="hidden"
          animate="visible"
        >
          有些人，光是遇见，就已经很幸运了。
        </motion.p>

        {/* Decorative line */}
        <motion.div
          custom={1}
          variants={textReveal}
          initial="hidden"
          animate="visible"
          className="w-12 h-px"
          style={{ background: 'oklch(0.72 0.13 85 / 0.4)' }}
        />

        {/* CTA */}
        <motion.p
          className="meqing-next-hint text-sm tracking-widest"
          style={{
            color: 'oklch(0.65 0.08 82)',
            fontFamily: 'var(--font-en, "Playfair Display", serif)',
          }}
          custom={2}
          variants={textReveal}
          initial="hidden"
          animate="visible"
        >
          Scroll to begin
        </motion.p>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 4, duration: 1.5 }}
      >
        <svg
          width="20"
          height="30"
          viewBox="0 0 20 30"
          fill="none"
          stroke="oklch(0.72 0.13 85)"
          strokeWidth="1.5"
        >
          <rect x="1" y="1" width="18" height="28" rx="9" />
          <motion.circle
            cx="10"
            cy="10"
            r="2"
            fill="oklch(0.72 0.13 85)"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
