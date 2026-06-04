import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import FloatingParticles from '../components/FloatingParticles'
import FilmGrain from '../components/FilmGrain'
import { useGsapVisibilityPause } from '../components/useGsapVisibilityPause'

/* ────────────────────────────────────────────────────────────
   OpeningPrologue — Cinematic Invitation Envelope
   Phase 1: Envelope   Phase 2: Opening   Phase 3: Security Question
   ──────────────────────────────────────────────────────────── */

interface OpeningPrologueProps {
  onNext: () => void
  onContentReady?: () => void
}

type Phase = 'envelope' | 'opening' | 'security' | 'correct'

const EASE_QUART = [0.25, 1, 0.5, 1] as [number, number, number, number]
const EASE_EXPOT = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Candlelight flicker (GSAP) ─────────────────────────── */
function CandleGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, {
      opacity: 0.18,
      scale: 1.06,
      duration: 2.2 + Math.random() * 1.5,
      ease: 'sine.inOut',
    })
      .to(el, {
        opacity: 0.09,
        scale: 0.94,
        duration: 1.8 + Math.random() * 1.2,
        ease: 'sine.inOut',
      })
      .to(el, {
        opacity: 0.15,
        scale: 1.02,
        duration: 2.0 + Math.random() * 1.0,
        ease: 'sine.inOut',
      })
    return () => { tl.kill() }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background:
          'radial-gradient(ellipse 55% 50% at 50% 40%, oklch(0.35 0.10 55 / 0.12) 0%, oklch(0.20 0.06 55 / 0.04) 40%, transparent 70%)',
      }}
    />
  )
}

/* ─── Wax Seal ───────────────────────────────────────────── */
function WaxSeal({ animate = true }: { animate?: boolean }) {
  return (
    <div className="relative w-14 h-14 md:w-16 md:h-16">
      {/* Seal body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, oklch(0.48 0.12 55), oklch(0.35 0.10 40), oklch(0.50 0.14 60), oklch(0.32 0.08 35), oklch(0.48 0.12 55))',
          boxShadow:
            '0 2px 8px oklch(0.20 0.06 40 / 0.6), inset 0 -1px 3px oklch(0.15 0.04 40 / 0.5), inset 0 1px 2px oklch(0.55 0.10 65 / 0.3)',
        }}
      />
      {/* Highlight sweep */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, transparent 30%, oklch(0.60 0.10 65 / 0.35) 48%, oklch(0.70 0.12 70 / 0.15) 52%, transparent 70%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
      {/* Center ornament */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"
            fill="oklch(0.55 0.10 55 / 0.6)"
            stroke="oklch(0.60 0.08 55 / 0.4)"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

/* ─── Key Icon (SVG) ─────────────────────────────────────── */
function KeyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="oklch(0.72 0.13 85 / 0.6)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="15" r="5" />
      <circle cx="8" cy="15" r="2" />
      <line x1="12.5" y1="11" x2="20" y2="3" />
      <line x1="17" y1="7" x2="20" y2="4" />
      <line x1="16" y1="9" x2="19" y2="6" />
    </svg>
  )
}

/* ─── Wood table texture (bottom) ────────────────────────── */
function WoodTable() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none z-0"
      style={{
        background: `linear-gradient(
          to bottom,
          oklch(0.04 0.015 270 / 0) 0%,
          oklch(0.08 0.015 45 / 0.3) 30%,
          oklch(0.06 0.012 40 / 0.5) 60%,
          oklch(0.05 0.01 35 / 0.7) 100%
        )`,
      }}
    >
      {/* Subtle grain lines for wood feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 8px,
            oklch(0.3 0.02 55 / 0.15) 8px,
            oklch(0.3 0.02 55 / 0.15) 9px
          )`,
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PHASE 1 — Envelope
   ═══════════════════════════════════════════════════════════ */
function EnvelopePhase({
  onClick,
  visible,
}: {
  onClick: () => void
  visible: boolean
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE_QUART }}
        >
          <WoodTable />
          <CandleGlow />
          <FloatingParticles count={18} color="oklch(0.72 0.13 85 / 0.5)" speed={0.15} />

          {/* The envelope card */}
          <motion.div
            className="relative z-10 cursor-pointer select-none"
            style={{ perspective: '800px' }}
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative w-[280px] h-[380px] md:w-[320px] md:h-[430px] rounded-2xl overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, oklch(0.10 0.01 270) 0%, oklch(0.07 0.008 270) 50%, oklch(0.10 0.012 270) 100%)
                `,
                boxShadow: `
                  0 20px 60px oklch(0.0 0 0 / 0.5),
                  0 8px 24px oklch(0.0 0 0 / 0.3),
                  0 2px 8px oklch(0.0 0 0 / 0.2)
                `,
                border: '1px solid oklch(0.15 0.01 85 / 0.15)',
              }}
              animate={{
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Leather texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, oklch(0.25 0.02 85) 0.5px, transparent 0.5px),
                    radial-gradient(circle at 60% 70%, oklch(0.25 0.02 85) 0.5px, transparent 0.5px),
                    radial-gradient(circle at 80% 20%, oklch(0.25 0.02 85) 0.5px, transparent 0.5px),
                    radial-gradient(circle at 40% 50%, oklch(0.25 0.02 85) 0.5px, transparent 0.5px)
                  `,
                  backgroundSize: '20px 20px, 28px 28px, 24px 24px, 32px 32px',
                }}
              />

              {/* Inner decorative border */}
              <div
                className="absolute inset-3 md:inset-4 rounded-xl pointer-events-none z-[1]"
                style={{
                  border: '0.5px solid oklch(0.72 0.13 85 / 0.08)',
                }}
              />

              {/* Content area */}
              <div className="relative z-[2] flex flex-col items-center justify-center h-full px-8 py-12">
                {/* Gold foil text */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.8, ease: EASE_EXPOT }}
                >
                  <p
                    className="text-lg md:text-xl tracking-[0.15em] mb-2"
                    style={{
                      color: 'oklch(0.72 0.13 85 / 0.7)',
                      fontFamily: 'var(--font-cn)',
                      textShadow: '0 0 20px oklch(0.72 0.13 85 / 0.15)',
                    }}
                  >
                    一封想亲自交给你的
                  </p>
                  <p
                    className="text-2xl md:text-3xl tracking-[0.2em]"
                    style={{
                      color: 'oklch(0.72 0.13 85 / 0.85)',
                      fontFamily: 'var(--font-cn)',
                      textShadow: '0 0 30px oklch(0.72 0.13 85 / 0.2)',
                    }}
                  >
                    特别邀请函
                  </p>
                </motion.div>

                {/* Wax seal — bottom center */}
                <motion.div
                  className="absolute bottom-8 md:bottom-10"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 1, ease: EASE_EXPOT }}
                >
                  <WaxSeal />
                </motion.div>
              </div>
            </motion.div>

            {/* Envelope shadow */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-[50%] blur-xl"
              style={{ background: 'oklch(0.0 0 0 / 0.25)' }}
            />
          </motion.div>

          {/* Click hint */}
          <motion.p
            className="relative z-10 mt-12 md:mt-16 text-sm tracking-[0.25em]"
            style={{
              color: 'oklch(0.65 0.08 82 / 0.5)',
              fontFamily: 'var(--font-cn)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            点击开启
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════
   PHASE 2 — Opening Animation
   ═══════════════════════════════════════════════════════════ */
function OpeningPhase({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Darkened background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ background: 'oklch(0.02 0.01 270)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Container that zooms in slightly */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 2, ease: EASE_EXPOT }}
      >
        {/* Light beams from center */}
        <motion.div
          className="absolute z-[2] pointer-events-none"
          style={{
            width: '120vw',
            height: '120vh',
            background: `radial-gradient(ellipse 40% 40% at 50% 50%, oklch(0.72 0.13 85 / 0.15) 0%, oklch(0.55 0.10 85 / 0.05) 30%, transparent 65%)`,
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.8, 0.4], scale: [0.3, 1.2, 1.0] }}
          transition={{
            duration: 2.2,
            ease: EASE_EXPOT,
            times: [0, 0.5, 1],
          }}
          onAnimationComplete={onComplete}
        />

        {/* Envelope lid opening (top part rotating up) */}
        <motion.div
          className="absolute z-[3]"
          style={{
            width: '280px',
            height: '120px',
            background: 'linear-gradient(to bottom, oklch(0.10 0.01 270), oklch(0.08 0.008 270))',
            transformOrigin: 'top center',
            borderRadius: '1rem 1rem 0 0',
            border: '1px solid oklch(0.15 0.01 85 / 0.12)',
            borderBottom: 'none',
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -70 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_QUART }}
        />

        {/* Content sliding up from envelope */}
        <motion.div
          className="absolute z-[4] w-[280px] h-[380px] md:w-[320px] md:h-[430px] rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, oklch(0.10 0.01 270) 0%, oklch(0.07 0.008 270) 100%)`,
            border: '1px solid oklch(0.15 0.01 85 / 0.15)',
          }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0, ease: EASE_EXPOT }}
        />

        {/* Background dims further */}
        <motion.div
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{ background: 'oklch(0.02 0.005 270)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PHASE 3 — Security Question Card
   ═══════════════════════════════════════════════════════════ */
function SecurityPhase({
  onNext,
}: {
  onNext: () => void
}) {
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showWrong, setShowWrong] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-focus input after phase entry
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 800)
    return () => clearTimeout(t)
  }, [])

  // Cleanup wrong answer timer
  useEffect(() => {
    return () => {
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = answer.trim()
    if (trimmed === '美啊') {
      setIsCorrect(true)
      setShowWrong(false)

      // Sequence: input glow → card aura → transition to Cover
      setTimeout(() => {
        onNext()
      }, 1500)
    } else {
      // Wrong answer: gentle dip + fade in hint
      setShowWrong(true)
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current)
      wrongTimerRef.current = setTimeout(() => setShowWrong(false), 2000)
    }
  }, [answer, onNext])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSubmit()
    },
    [handleSubmit],
  )

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_QUART }}
    >
      {/* Background ambient */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.12 0.02 85 / 0.08) 0%, oklch(0.04 0.01 270) 70%)',
        }}
      />

      {/* Warm glow behind card */}
      <motion.div
        className="pointer-events-none absolute z-[1]"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, oklch(0.72 0.13 85 / 0.06) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      />

      {/* Correct sequence: golden aura */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            className="pointer-events-none absolute z-[2]"
            style={{
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at center, oklch(0.72 0.13 85 / 0.15) 0%, oklch(0.72 0.13 85 / 0.04) 40%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 2, ease: EASE_EXPOT }}
          />
        )}
      </AnimatePresence>

      {/* Welcome text removed — direct transition to Cover */}

      {/* The Card */}
      <motion.div
        className="relative z-10 w-full max-w-[340px]"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE_EXPOT }}
      >
        <div
          className="rounded-2xl px-7 py-8 md:px-8 md:py-9 relative overflow-hidden transition-all duration-1000"
          style={{
            background: 'oklch(0.08 0.01 270 / 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid oklch(0.72 0.13 85 / 0.18)',
            boxShadow: isCorrect
              ? '0 0 60px oklch(0.72 0.13 85 / 0.15), 0 20px 50px oklch(0.0 0 0 / 0.3)'
              : '0 20px 50px oklch(0.0 0 0 / 0.25)',
          }}
        >
          {/* Subtle inner gradient */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              background:
                'linear-gradient(160deg, oklch(0.72 0.13 85) 0%, transparent 50%)',
            }}
          />

          {/* Key icon */}
          <motion.div
            className="flex justify-center mb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <KeyIcon />
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-center text-xl md:text-2xl mb-2"
            style={{
              color: 'oklch(0.88 0.02 80)',
              fontFamily: 'var(--font-cn)',
              letterSpacing: '0.1em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            开启邀请函
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-center text-sm mb-6"
            style={{
              color: 'oklch(0.60 0.015 80 / 0.6)',
              fontFamily: 'var(--font-cn)',
              lineHeight: 1.8,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            这封邀请函，有一个只有你才知道的答案。
          </motion.p>

          {/* Decorative gold line */}
          <motion.div
            className="mx-auto w-10 h-px mb-6"
            style={{ background: 'oklch(0.72 0.13 85 / 0.25)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE_EXPOT }}
          />

          {/* Question label */}
          <motion.p
            className="text-center text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{
              color: 'oklch(0.72 0.13 85 / 0.5)',
              fontFamily: 'var(--font-en)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            密保问题
          </motion.p>

          {/* Question */}
          <motion.p
            className="text-center text-base md:text-lg mb-5"
            style={{
              color: 'oklch(0.90 0.015 80 / 0.85)',
              fontFamily: 'var(--font-cn)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            我给你的备注
          </motion.p>

          {/* Input field */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value)
                if (showWrong) setShowWrong(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder="请输入答案"
              readOnly={isCorrect}
              className="w-full text-center text-base py-3 px-4 rounded-lg outline-none transition-all duration-500"
              style={{
                background: isCorrect
                  ? 'oklch(0.12 0.015 85 / 0.15)'
                  : 'oklch(0.08 0.01 270 / 0.4)',
                border: isCorrect
                  ? '1px solid oklch(0.72 0.13 85 / 0.4)'
                  : '1px solid oklch(0.25 0.02 270 / 0.15)',
                color: 'oklch(0.88 0.015 80)',
                fontFamily: 'var(--font-cn)',
                boxShadow: isCorrect
                  ? '0 0 30px oklch(0.72 0.13 85 / 0.12), inset 0 0 15px oklch(0.72 0.13 85 / 0.05)'
                  : 'none',
              }}
              onFocus={(e) => {
                if (!isCorrect) {
                  e.currentTarget.style.borderColor = 'oklch(0.72 0.13 85 / 0.3)'
                  e.currentTarget.style.boxShadow =
                    '0 0 15px oklch(0.72 0.13 85 / 0.08)'
                }
              }}
              onBlur={(e) => {
                if (!isCorrect) {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.02 270 / 0.15)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
            {/* Gold focus glow animation */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow: '0 0 20px oklch(0.72 0.13 85 / 0.15)',
                opacity: isCorrect ? 1 : 0,
              }}
              animate={isCorrect ? { opacity: [0, 1, 0.6, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Wrong answer hint */}
          <AnimatePresence>
            {showWrong && (
              <motion.p
                className="text-center text-xs mt-4"
                style={{
                  color: 'oklch(0.60 0.015 80 / 0.4)',
                  fontFamily: 'var(--font-cn)',
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.5 }}
              >
                再想想。
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function OpeningPrologue({
  onNext,
  onContentReady,
}: OpeningPrologueProps) {
  const [phase, setPhase] = useState<Phase>('envelope')

  useEffect(() => {
    onContentReady?.()
  }, [onContentReady])

  useGsapVisibilityPause()

  const handleEnvelopeClick = useCallback(() => {
    setPhase('opening')
  }, [])

  const handleOpeningComplete = useCallback(() => {
    setPhase('security')
  }, [])

  return (
    <div
      className="meqing-chapter"
      style={{
        background: 'oklch(0.04 0.015 270)',
      }}
    >
      <FilmGrain />

      {/* Phase 1: Envelope */}
      <EnvelopePhase
        visible={phase === 'envelope'}
        onClick={handleEnvelopeClick}
      />

      {/* Phase 2: Opening animation */}
      <AnimatePresence>
        {phase === 'opening' && (
          <OpeningPhase onComplete={handleOpeningComplete} />
        )}
      </AnimatePresence>

      {/* Phase 3: Security question */}
      <AnimatePresence>
        {phase === 'security' && (
          <SecurityPhase onNext={onNext} />
        )}
      </AnimatePresence>
    </div>
  )
}
