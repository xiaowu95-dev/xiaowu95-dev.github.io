import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import gsap from 'gsap'

interface FallingInLoveProps {
  onNext: () => void
}

/* ─── color tokens — deep night city ──────────────────── */
const C = {
  bgTop: 'oklch(0.04 0.01 260)',
  bgBottom: 'oklch(0.02 0.005 260)',
  bokehWarm: 'oklch(0.55 0.12 80 / 0.15)',
  bokehCool: 'oklch(0.45 0.08 250 / 0.12)',
  textPrimary: 'oklch(0.92 0.012 75)',
  textDim: 'oklch(0.55 0.01 75)',
  accent: 'oklch(0.72 0.10 85)',
  accentLight: 'oklch(0.82 0.06 85)',
  glass: 'oklch(0.08 0.015 260 / 0.4)',
  border: 'oklch(0.25 0.03 260 / 0.15)',
  rain: 'oklch(0.6 0.02 240 / 0.06)',
}

/* ─── easing curve ───────────────────────────────────── */
const E = [0.25, 1, 0.5, 1] as [number, number, number, number]

/* ═══════════════════════════════════════════════════════
   Bokeh lights — CSS radial gradients with slow drift
   ═══════════════════════════════════════════════════════ */
function BokehLights() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gsapCtx = useRef<gsap.Context | null>(null)

  /* Pre-computed bokeh positions */
  const lights = useMemo(() => {
    const arr: Array<{
      x: number; y: number; size: number
      color: string; opacity: number; speed: number; drift: number
    }> = []
    for (let i = 0; i < 18; i++) {
      const isWarm = i % 3 !== 0
      arr.push({
        x: Math.random() * 100,
        y: 15 + Math.random() * 70,
        size: 40 + Math.random() * 120,
        color: isWarm ? C.bokehWarm : C.bokehCool,
        opacity: 0.06 + Math.random() * 0.12,
        speed: 12 + Math.random() * 20,
        drift: 5 + Math.random() * 15,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const children = containerRef.current.children
    gsapCtx.current = gsap.context(() => {
      for (let i = 0; i < children.length; i++) {
        const el = children[i] as HTMLElement
        const l = lights[i]
        gsap.to(el, {
          x: l.drift,
          y: -l.drift * 0.6,
          duration: l.speed,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
    }, containerRef)
    return () => { gsapCtx.current?.revert() }
  }, [lights])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {lights.map((l, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: l.size,
            height: l.size,
            background: `radial-gradient(circle, ${l.color}, transparent 70%)`,
            opacity: l.opacity,
            filter: `blur(${10 + Math.random() * 20}px)`,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Light trails — thin horizontal streaks, slow drift
   ═══════════════════════════════════════════════════════ */
function LightTrails() {
  const trails = useMemo(() => {
    const arr: Array<{ top: number; width: number; delay: number; opacity: number; color: string }> = []
    for (let i = 0; i < 6; i++) {
      const isWarm = i % 2 === 0
      arr.push({
        top: 25 + Math.random() * 50,
        width: 150 + Math.random() * 300,
        delay: Math.random() * 8,
        opacity: 0.03 + Math.random() * 0.04,
        color: isWarm
          ? 'oklch(0.7 0.12 80 / VAR)'
          : 'oklch(0.55 0.06 240 / VAR)',
      })
    }
    return arr
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {trails.map((t, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px]"
          style={{
            top: `${t.top}%`,
            width: t.width,
            opacity: t.opacity,
            background: `linear-gradient(to right, transparent, ${t.color.replace('VAR', String(t.opacity * 3))}, transparent)`,
          }}
          animate={{
            x: ['-100%', '120vw'],
          }}
          transition={{
            duration: 18 + Math.random() * 10,
            delay: t.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Rain effect — CSS-only thin diagonal lines
   ═══════════════════════════════════════════════════════ */
function RainOverlay() {
  const drops = useMemo(() => {
    const arr: Array<{ left: number; delay: number; duration: number; height: number; opacity: number }> = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 1.5,
        height: 30 + Math.random() * 50,
        opacity: 0.04 + Math.random() * 0.05,
      })
    }
    return arr
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: -d.height,
            width: 1,
            height: d.height,
            background: `linear-gradient(to bottom, transparent, ${C.rain})`,
            transform: 'rotate(8deg)',
            opacity: d.opacity,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rain-fall {
          0% { transform: rotate(8deg) translateY(0); opacity: var(--rain-opacity, 0.05); }
          80% { opacity: var(--rain-opacity, 0.05); }
          100% { transform: rotate(8deg) translateY(105vh); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Memory fragment — ghostly UI snippets
   ═══════════════════════════════════════════════════════ */
type FragmentVariant = 'wechat-input' | 'map-search' | 'restaurant-snippet' | 'chat-list'

interface FragmentDef {
  variant: FragmentVariant
  x: number
  y: number
  rotate: number
  delay: number
  scale: number
}

function MemoryFragment({ def, visible }: { def: FragmentDef; visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  /* GSAP floating oscillation */
  useEffect(() => {
    if (!visible || !ref.current) return
    const el = ref.current
    const ampX = 3 + Math.random() * 6
    const ampY = 2 + Math.random() * 4
    const durX = 5 + Math.random() * 3
    const durY = 4 + Math.random() * 3
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { x: ampX, duration: durX, ease: 'sine.inOut' })
      .to(el, { y: ampY, duration: durY, ease: 'sine.inOut' }, 0)
    return () => { tl.kill() }
  }, [visible])

  const renderContent = () => {
    switch (def.variant) {
      case 'wechat-input':
        return (
          <div className="flex flex-col gap-1">
            <div
              className="rounded-full px-3 py-1.5 text-xs flex items-center gap-2"
              style={{
                background: 'oklch(0.10 0.01 260 / 0.6)',
                border: `1px solid oklch(0.2 0.02 260 / 0.2)`,
              }}
            >
              <span style={{ color: C.textDim, fontFamily: 'var(--font-cn)' }}>正在输入...</span>
              <span className="inline-block w-[2px] h-[12px] bg-white/30 animate-pulse" />
            </div>
          </div>
        )
      case 'map-search':
        return (
          <div className="flex flex-col gap-1">
            <div
              className="rounded-lg px-3 py-2 text-xs"
              style={{
                background: 'oklch(0.10 0.01 260 / 0.6)',
                border: `1px solid oklch(0.2 0.02 260 / 0.2)`,
              }}
            >
              <span style={{ color: C.textDim, fontFamily: 'var(--font-cn)' }}>🔍 盐和炭火</span>
            </div>
          </div>
        )
      case 'restaurant-snippet':
        return (
          <div
            className="rounded-lg overflow-hidden max-w-[140px]"
            style={{
              background: 'oklch(0.10 0.01 260 / 0.6)',
              border: `1px solid oklch(0.2 0.02 260 / 0.2)`,
            }}
          >
            <div
              className="aspect-[16/9] flex items-center justify-center"
              style={{ background: 'oklch(0.08 0.015 260 / 0.5)' }}
            >
              <span className="text-lg opacity-20">🍗</span>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-[10px]" style={{ color: C.textDim, fontFamily: 'var(--font-cn)' }}>盐和炭火·烧鸟</p>
              <p className="text-[9px]" style={{ color: C.textDim }}>⭐ 4.8 · 居酒屋</p>
            </div>
          </div>
        )
      case 'chat-list':
        return (
          <div
            className="rounded-lg px-3 py-2 max-w-[160px]"
            style={{
              background: 'oklch(0.10 0.01 260 / 0.6)',
              border: `1px solid oklch(0.2 0.02 260 / 0.2)`,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                style={{ background: C.accent, color: C.bgTop }}
              >
                美
              </div>
              <div>
                <p className="text-[10px]" style={{ color: C.accentLight, fontFamily: 'var(--font-cn)' }}>美箐</p>
                <p className="text-[9px]" style={{ color: C.textDim }}>...</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 30 }}
      transition={{
        duration: 1.5,
        delay: def.delay,
        ease: E,
      }}
      className="absolute"
      style={{
        left: `${def.x}%`,
        top: `${def.y}%`,
        transform: `rotate(${def.rotate}deg) scale(${def.scale})`,
        filter: 'blur(1px)',
        opacity: visible ? undefined : 0,
      }}
    >
      {renderContent()}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   Draft Invitation Card — glass morphism with gold shimmer
   ═══════════════════════════════════════════════════════ */
function DraftCard({ visible, shimmerDelay }: { visible: boolean; shimmerDelay: number }) {
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible || !shimmerRef.current) return
    const t = setTimeout(() => {
      if (!shimmerRef.current) return
      gsap.to(shimmerRef.current, {
        backgroundPosition: '200% center',
        duration: 6,
        ease: 'none',
        repeat: -1,
      })
    }, shimmerDelay)
    return () => clearTimeout(t)
  }, [visible, shimmerDelay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 2.2, ease: E }}
      className="relative max-w-[280px] w-full mx-auto"
    >
      {/* Breathing glow */}
      <motion.div
        className="absolute -inset-6 pointer-events-none -z-10 rounded-2xl"
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(ellipse at center, ${C.accent}, transparent 70%)`,
        }}
      />

      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          background: C.glass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${C.border}`,
          boxShadow: `
            0 0 0 1px oklch(0.25 0.03 260 / 0.08),
            0 4px 20px oklch(0.02 0.01 260 / 0.3),
            0 16px 50px oklch(0.02 0.01 260 / 0.5),
            inset 0 1px 0 oklch(0.25 0.03 260 / 0.1)
          `,
        }}
      >
        {/* Gold shimmer sweep overlay */}
        <div
          ref={shimmerRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(
              105deg,
              transparent 40%,
              oklch(0.72 0.10 85 / 0.03) 44%,
              oklch(0.72 0.10 85 / 0.08) 50%,
              oklch(0.72 0.10 85 / 0.03) 56%,
              transparent 60%
            )`,
            backgroundSize: '200% 100%',
            backgroundPosition: '0% center',
          }}
        />

        {/* Card content */}
        <div className="relative z-20 px-7 py-8 md:px-9 md:py-10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 0.5 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: C.textDim, fontFamily: 'var(--font-en)' }}
          >
            Draft
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1.2, ease: E }}
            className="text-2xl font-light tracking-[0.15em] mb-1"
            style={{ color: C.textPrimary, fontFamily: 'var(--font-cn)' }}
          >
            6 月 5 日
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 1.2, ease: E }}
            className="text-lg font-light tracking-[0.12em]"
            style={{ color: C.accentLight, fontFamily: 'var(--font-cn)' }}
          >
            晚上 6:00
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   Floating particles — dust/light motes
   ═══════════════════════════════════════════════════════ */
function FloatingDust({ count = 12 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const particles = useMemo(() => {
    const arr: Array<{ x: number; y: number; size: number; opacity: number; duration: number; delay: number }> = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.2,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 5,
      })
    }
    return arr
  }, [count])

  useEffect(() => {
    if (!containerRef.current) return
    const children = containerRef.current.children
    const ctx = gsap.context(() => {
      for (let i = 0; i < children.length; i++) {
        const el = children[i] as HTMLElement
        gsap.to(el, {
          y: -20 - Math.random() * 30,
          x: (Math.random() - 0.5) * 20,
          opacity: 0,
          duration: particles[i].duration,
          delay: particles[i].delay,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [particles])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'oklch(0.9 0.01 80)',
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Memory fragment definitions
   ═══════════════════════════════════════════════════════ */
const FRAGMENTS: FragmentDef[] = [
  { variant: 'wechat-input', x: 8, y: 25, rotate: -2, delay: 0, scale: 0.9 },
  { variant: 'map-search', x: 60, y: 18, rotate: 1.5, delay: 0.4, scale: 0.85 },
  { variant: 'restaurant-snippet', x: 25, y: 50, rotate: -1, delay: 0.8, scale: 0.88 },
  { variant: 'chat-list', x: 65, y: 55, rotate: 2, delay: 1.2, scale: 0.82 },
]

/* ═══════════════════════════════════════════════════════
   Chapter III — FallingInLove (赴约前夜)
   "我开始期待见到你。"
   ═══════════════════════════════════════════════════════ */
export default function FallingInLove({ onNext }: FallingInLoveProps) {
  const [layer1, setLayer1] = useState(false)
  const [layer2, setLayer2] = useState(false)
  const [layer2Text, setLayer2Text] = useState(false)
  const [layer3, setLayer3] = useState(false)
  const [layer4, setLayer4] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [fragmentsFading, setFragmentsFading] = useState(false)
  const [cityBlur, setCityBlur] = useState(false)

  /* ─── Phase timing ─────────────────────────────────────── */
  useEffect(() => {
    const timers = [
      /* Layer 1: 0s */
      setTimeout(() => setLayer1(true), 300),
      /* Layer 2: 4s */
      setTimeout(() => setLayer2(true), 4000),
      setTimeout(() => setLayer2Text(true), 6500),
      /* Layer 3: 9s */
      setTimeout(() => setLayer3(true), 9000),
      /* Layer 4: 14s */
      setTimeout(() => {
        setFragmentsFading(true)
        setCityBlur(true)
      }, 14000),
      setTimeout(() => setLayer4(true), 14800),
      /* Page End: 18s */
      setTimeout(() => setShowDate(true), 18000),
      setTimeout(() => setShowButton(true), 18800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="meqing-chapter relative w-full min-h-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgBottom} 100%)`,
        color: C.textPrimary,
      }}
    >
      {/* ─── Film grain overlay ─── */}
      <div className="meqing-grain pointer-events-none absolute inset-0 z-50" />

      {/* ─── Bokeh city lights (parallax depth) ─── */}
      <div
        className="transition-[filter] duration-[4000ms]"
        style={{ filter: cityBlur ? 'blur(6px)' : 'none' }}
      >
        <BokehLights />
      </div>

      {/* ─── Light trails ─── */}
      <LightTrails />

      {/* ─── Rain effect ─── */}
      <RainOverlay />

      {/* ─── Floating dust particles ─── */}
      <FloatingDust count={14} />

      {/* ─── Ambient glow — city reflection ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 30% 70%, oklch(0.15 0.06 55 / 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 30% 40% at 70% 40%, oklch(0.12 0.05 240 / 0.03) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 50% 50%, oklch(0.06 0.02 260 / 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════
          Main Content Layer
          ═══════════════════════════════════════════════ */}
      <div className="relative z-10 min-h-full flex flex-col">

        {/* ─── LAYER 1: Time (0-4s) ─── */}
        <AnimatePresence>
          {layer1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: E }}
              className="absolute top-6 left-6 md:top-10 md:left-10 z-20"
            >
              <p
                className="text-4xl md:text-5xl font-extralight tracking-[0.15em]"
                style={{
                  color: C.textDim,
                  fontFamily: 'var(--font-en, sans-serif)',
                  opacity: 0.6,
                }}
              >
                00:42
              </p>
              <p
                className="text-[10px] tracking-[0.25em] mt-1 uppercase"
                style={{ color: C.textDim, fontFamily: 'var(--font-en, sans-serif)', opacity: 0.4 }}
              >
                AM
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── LAYER 2: Draft Card (4-9s) ─── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <AnimatePresence>
            {layer2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: E }}
                className="w-full"
              >
                <DraftCard visible={layer2} shimmerDelay={2000} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* "突然开始期待那一天。" */}
          <AnimatePresence>
            {layer2Text && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: E }}
                className="text-center mt-10 text-sm md:text-base leading-relaxed max-w-xs"
                style={{ color: C.textDim, fontFamily: 'var(--font-cn)' }}
              >
                突然开始期待那一天。
              </motion.p>
            )}
          </AnimatePresence>

          {/* ─── LAYER 3: Memory Fragments (9-14s) ─── */}
          <AnimatePresence>
            {layer3 && !fragmentsFading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="relative w-full h-[300px] md:h-[360px] mt-12"
              >
                {FRAGMENTS.map((def, i) => (
                  <MemoryFragment key={i} def={def} visible={layer3 && !fragmentsFading} />
                ))}

                {/* depth blur gradient at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, transparent, oklch(0.02 0.005 260))`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── LAYER 4: Realization (14-18s) ─── */}
        <div className="flex-1 flex flex-col items-end justify-end px-6 md:px-10 pb-28">
          <AnimatePresence>
            {layer4 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, ease: E }}
                className="w-full max-w-lg"
              >
                {/* Film subtitle style — lower, left-aligned, dim */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{
                    color: C.textDim,
                    fontFamily: 'var(--font-cn)',
                    opacity: 0.55,
                    textAlign: 'left',
                    paddingLeft: '8%',
                  }}
                >
                  后来我发现，我开始期待见到你。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Page End: Date + Button (18-20s) ─── */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 flex flex-col items-end gap-4">
          <AnimatePresence>
            {showDate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: E }}
                className="text-xs tracking-[0.2em]"
                style={{
                  color: C.textDim,
                  fontFamily: 'var(--font-en, sans-serif)',
                }}
              >
                06.05
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: E }}
                onClick={onNext}
                className="falling-in-love-btn px-6 py-2.5 rounded-full text-sm tracking-wider cursor-pointer"
                style={{ fontFamily: 'var(--font-cn)' }}
              >
                赴约
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Button styles ─── */}
      <style>{`
        .falling-in-love-btn {
          background: transparent;
          border: 1px solid oklch(0.72 0.10 85 / 0.2);
          color: oklch(0.82 0.06 85);
          transition: all 0.4s ease;
        }
        .falling-in-love-btn:hover {
          border-color: oklch(0.72 0.10 85 / 0.45);
          box-shadow: 0 0 24px oklch(0.72 0.10 85 / 0.08);
        }
        .falling-in-love-btn:active {
          border-color: oklch(0.72 0.10 85 / 0.6);
          box-shadow: 0 0 32px oklch(0.72 0.10 85 / 0.12);
        }
      `}</style>
    </div>
  )
}
