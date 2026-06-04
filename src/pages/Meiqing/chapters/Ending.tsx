import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import StarField from '../components/StarField'

interface EndingProps {
  onPrev: () => void
  onContentReady?: () => void
}

const E = [0.25, 1, 0.5, 1] as [number, number, number, number]

/* ═══════════════════════════════════════════════════════
   Ending — 最安静的一页
   
   "故事没有停在这里。"
   "它会在 6 月 5 日，继续发生。"
   
   from 王仔
   to 美箐
   
   没有烟花，没有告白，没有语音。
   只有深夜、星光、和即将发生的约会。
   ═══════════════════════════════════════════════════════ */
export default function Ending({ onPrev: _onPrev, onContentReady }: EndingProps) {
  const [phase, setPhase] = useState<'waiting' | 'line1' | 'line2' | 'signature'>('waiting')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('line1'), 2500)
    const t2 = setTimeout(() => setPhase('line2'), 6500)
    const t3 = setTimeout(() => setPhase('signature'), 10500)
    const t4 = setTimeout(() => onContentReady?.(), 11000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onContentReady])

  return (
    <div
      className="relative w-full min-h-full flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse 100% 80% at 50% 60%, oklch(0.06 0.01 270) 0%, oklch(0.03 0.005 270) 100%)',
      }}
    >
      {/* sparse, quiet starfield */}
      <StarField count={50} />

      {/* slow breathing warm light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[40vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, oklch(0.10 0.02 50 / 0.06) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* slow fade-to-dark overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'oklch(0.02 0.005 270)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 20, ease: 'linear' }}
      />

      <div className="relative z-10 text-center px-8 max-w-lg">
        {/* Line 1 */}
        <AnimatePresence>
          {(phase === 'line1' || phase === 'line2' || phase === 'signature') && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, ease: E }}
              className="meqing-quote mb-10"
              style={{ color: 'oklch(0.94 0.015 80)' }}
            >
              故事没有停在这里。
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 2 */}
        <AnimatePresence>
          {(phase === 'line2' || phase === 'signature') && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, ease: E }}
              className="meqing-quote mb-16"
              style={{ color: 'oklch(0.94 0.015 80)' }}
            >
              它会在{' '}
              <span style={{ color: 'oklch(0.78 0.10 85)' }}>6 月 5 日</span>
              ，<br />继续发生。
            </motion.p>
          )}
        </AnimatePresence>

        {/* Signature */}
        <AnimatePresence>
          {phase === 'signature' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.5, delay: 0.5, ease: E }}
            >
              <div
                className="w-12 h-px mx-auto mb-10"
                style={{ background: 'oklch(0.78 0.10 85 / 0.2)' }}
              />

              <p
                className="text-sm tracking-wider mb-1.5"
                style={{
                  color: 'oklch(0.55 0.01 75)',
                  fontFamily: 'var(--font-en, "Playfair Display", serif)',
                }}
              >
                from 王仔
              </p>
              <p
                className="text-sm tracking-wider"
                style={{
                  color: 'oklch(0.55 0.01 75)',
                  fontFamily: 'var(--font-en, "Playfair Display", serif)',
                }}
              >
                to 美箐
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
