import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { timeline, locations } from '../memories'
import gsap from 'gsap'

interface FirstMeetProps {
  onNext: () => void
  onContentReady?: () => void
}

/* ─── color tokens ──────────────────────────────────── */
const C = {
  bg: 'oklch(0.05 0.01 270)',
  lamp: 'oklch(0.22 0.06 55)',
  moon: 'oklch(0.12 0.04 280)',
  warm: 'oklch(0.94 0.015 80)',
  dim: 'oklch(0.65 0.012 75)',
  accent: 'oklch(0.72 0.13 85)',
  border: 'oklch(0.25 0.03 270 / 0.2)',
  glass: 'oklch(0.10 0.015 270 / 0.25)',
}

/* ─── Location image map (each location gets a unique scene) ─ */
const locationImageMap: Record<string, string> = {
  '星海广场': 'ghibli-amusement.png',
  '海底捞': 'ghibli-cat-cafe.png',
  '雕塑公园': 'ghibli-park.png',
  '游乐场': 'ghibli-couple-rain.png',
  '电影院': 'ghibli-rooftop-neon.png',
  '黑石礁公园': 'ghibli-ocean-rocks.png',
  '攀岩馆': 'ghibli-phone-window.png',
}

/* ─── Rain Canvas ───────────────────────────────────── */
function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const drops: { x: number; y: number; speed: number; len: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 3 + Math.random() * 5,
        len: 12 + Math.random() * 18,
        alpha: 0.08 + Math.random() * 0.12,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const d of drops) {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - 0.5, d.y + d.len)
        ctx.strokeStyle = `oklch(0.7 0.02 240 / ${d.alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
        d.y += d.speed
        if (d.y > canvas.height) {
          d.y = -d.len
          d.x = Math.random() * canvas.width
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.5 }}
    />
  )
}

/* ─── Memory fragment shapes ────────────────────────── */
type MemoryVariant = 'chat-bubble' | 'friend-request' | 'video-call' | 'photo-card' | 'ticket' | 'typing'

const variantMap: MemoryVariant[] = ['chat-bubble', 'friend-request', 'video-call', 'photo-card', 'ticket', 'typing']

/* ─── Single floating memory ────────────────────────── */
function FloatingMemory({
  event,
  variant,
  index,
}: {
  event: (typeof timeline)[0]
  variant: MemoryVariant
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  /* GSAP floating oscillation */
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const ampX = 4 + Math.random() * 8
    const ampY = 3 + Math.random() * 6
    const durX = 4 + Math.random() * 3
    const durY = 3 + Math.random() * 3
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { x: ampX, duration: durX, ease: 'sine.inOut' })
      .to(el, { y: ampY, duration: durY, ease: 'sine.inOut' }, 0)
    return () => { tl.kill() }
  }, [inView])

  /* atmospheric scene images per variant (unique images for each) */
  const renderScene = () => {
    const sceneMap: Record<string, string> = {
      'chat-bubble': '/meiqing/scenes/ghibli-friend-request.png',
      'friend-request': '/meiqing/scenes/ghibli-rain-city.png',
      'video-call': '/meiqing/scenes/ghibli-rooftop-neon.png',
      'photo-card': '/meiqing/scenes/ghibli-hotpot.png',
      'ticket': '/meiqing/scenes/ghibli-cinema.png',
      'typing': '/meiqing/scenes/ghibli-ramen-rain.png',
    }
    const src = sceneMap[variant] || '/meiqing/scenes/ghibli-phone-window.png'
    return (
      <div className="aspect-[4/3] relative overflow-hidden" style={{ background: C.bg }}>
        <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.6) saturate(0.75)' }} />
      </div>
    )
  }

  /* different visual per variant */
  const renderContent = () => {
    switch (variant) {
      case 'chat-bubble':
        return (
          <div
            className="relative rounded-2xl rounded-bl-sm overflow-hidden max-w-[260px]"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-4 py-3">
              <p className="text-sm leading-relaxed" style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}>
                {event.description}
              </p>
              <span className="mt-1.5 block text-xs" style={{ color: C.dim, fontFamily: 'var(--font-en)' }}>
                {event.date}
              </span>
            </div>
          </div>
        )

      case 'friend-request':
        return (
          <div
            className="rounded-2xl overflow-hidden max-w-[260px]"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs" style={{ background: C.accent, color: C.bg }}>
                  👤
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}>
                    好友申请
                  </p>
                  <p className="text-xs" style={{ color: C.dim }}>{event.date}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}>
                {event.description}
              </p>
            </div>
          </div>
        )

      case 'video-call':
        return (
          <div
            className="rounded-2xl overflow-hidden max-w-[220px]"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-4 py-2.5">
              <p className="text-xs leading-relaxed mb-1" style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}>
                {event.description}
              </p>
              <span className="text-xs" style={{ color: C.dim }}>{event.date}</span>
            </div>
          </div>
        )

      case 'photo-card':
        return (
          <div
            className="rounded-xl overflow-hidden max-w-[200px]"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-3 py-2">
              <p className="text-xs" style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}>{event.description}</p>
              <span className="text-[10px] mt-1 block" style={{ color: C.dim }}>{event.date}</span>
            </div>
          </div>
        )

      case 'ticket':
        return (
          <div
            className="rounded-xl overflow-hidden max-w-[240px] relative"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-4 py-3 relative">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.accent, fontFamily: 'var(--font-en)' }}>
                🎬
              </p>
              <p className="text-sm leading-relaxed mb-1.5" style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}>
                {event.description}
              </p>
              <span className="text-xs" style={{ color: C.dim }}>{event.date}</span>
            </div>
          </div>
        )

      case 'typing':
        return (
          <div
            className="rounded-2xl overflow-hidden max-w-[200px]"
            style={{ background: C.glass, border: `1px solid ${C.border}` }}
          >
            {renderScene()}
            <div className="px-4 py-3">
              <p className="text-xs mb-2" style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}>
                {event.description}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.accent, animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.accent, animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.accent, animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] mt-1.5 block" style={{ color: C.dim }}>{event.date}</span>
            </div>
          </div>
        )
    }
  }

  /* scatter positions for organic feel */
  const scatterX = [0, 30, -20, 40, -35, 15][index % 6]
  const scatterY = [0, -15, 20, -10, 25, -20][index % 6]
  const scatterRotate = [-2, 1.5, -1, 2, -1.5, 1][index % 6]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 + Math.random() * 20, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: scatterY, scale: 1 } : {}}
      transition={{ duration: 1.2, delay: index * 0.2, ease: [0.25, 1, 0.5, 1] }}
      className="relative"
      style={{ transform: `translateX(${scatterX}px) rotate(${scatterRotate}deg)` }}
    >
      {renderContent()}
    </motion.div>
  )
}

/* ─── Location card ─────────────────────────────────── */
function LocationCard({ loc, index }: { loc: (typeof locations)[0]; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  /* GSAP gentle float */
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { y: 3 + Math.random() * 4, duration: 3 + Math.random() * 2, ease: 'sine.inOut' })
    return () => { tl.kill() }
  }, [inView])

  const scatterX = [0, -25, 30, -15, 35, -30, 20][index % 7]
  const scatterRotate = [-1.5, 1, -2, 1.5, -0.5, 2, -1][index % 7]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
      className="cursor-pointer"
      style={{ transform: `translateX(${scatterX}px) rotate(${scatterRotate}deg)` }}
      onClick={() => setRevealed(!revealed)}
    >
      <div
        className="rounded-xl overflow-hidden max-w-[180px] transition-all duration-500"
        style={{
          background: C.glass,
          border: `1px solid ${C.border}`,
          transform: revealed ? 'scale(1.08)' : undefined,
        }}
      >
        <div className="aspect-[4/3] flex items-center justify-center relative overflow-hidden" style={{ background: C.moon }}>
          {/* per-location atmospheric scene */}
          {(() => {
            const locationSrc = locationImageMap[loc.name] || 'xinghai-square.jpg'
            return (
              <img
                src={`/meiqing/scenes/${locationSrc}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.6) saturate(0.75)' }}
              />
            )
          })()}
          <span className="text-xl opacity-20 relative z-10">📍</span>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium" style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}>
            {loc.name}
          </p>
          <AnimatePresence>
            {revealed && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs leading-relaxed mt-1.5 overflow-hidden"
                style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}
              >
                {loc.memory}
              </motion.p>
            )}
          </AnimatePresence>
          {!revealed && (
            <p className="text-[10px] mt-1" style={{ color: C.dim }}>轻触回忆</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────── */
/*  FirstMeet — 慢慢靠近 (Chapter II)                     */
/*  四幕：深夜 → 记忆漂浮 → 散落的地点 → 独白             */
/* ────────────────────────────────────────────────────── */
export default function FirstMeet({ onContentReady }: FirstMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Content is scroll-driven, ready immediately
  useEffect(() => { onContentReady?.() }, [onContentReady])

  /* ─── ACT 1: Deep Night ─────────────────────────────── */
  const act1Ref = useRef<HTMLDivElement>(null)
  const act1InView = useInView(act1Ref, { once: true, margin: '-10%' })

  /* ─── ACT 2: Floating Memories ──────────────────────── */
  const act2Ref = useRef<HTMLDivElement>(null)

  /* ─── ACT 3: Scattered Locations ────────────────────── */
  const act3Ref = useRef<HTMLDivElement>(null)
  const act3InView = useInView(act3Ref, { once: true, margin: '-10%' })

  /* ─── ACT 4: Monologue ──────────────────────────────── */
  const act4Ref = useRef<HTMLDivElement>(null)
  const act4InView = useInView(act4Ref, { once: true, margin: '-10%' })

  return (
    <div
      ref={containerRef}
      className="meqing-chapter-inner relative min-h-screen overflow-y-auto overflow-x-hidden"
      style={{ background: C.bg, color: C.warm }}
    >
      {/* film grain overlay */}
      <div className="meqing-grain pointer-events-none absolute inset-0 z-50" />

      {/* rain */}
      <RainCanvas />

      {/* ambient lights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* desk lamp */}
        <div
          className="absolute top-[15%] left-[10%] w-[300px] h-[400px] opacity-[0.07]"
          style={{ background: `radial-gradient(ellipse at center, ${C.lamp}, transparent 70%)` }}
        />
        {/* phone glow */}
        <div
          className="absolute top-[30%] right-[8%] w-[200px] h-[300px] opacity-[0.05]"
          style={{ background: `radial-gradient(ellipse at center, oklch(0.6 0.08 240), transparent 70%)` }}
        />
        {/* moonlight */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[600px] opacity-[0.03]"
          style={{ background: `radial-gradient(ellipse at top right, ${C.moon}, transparent 70%)` }}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          ACT 1 — 深夜
          ════════════════════════════════════════════════════ */}
      <section
        ref={act1Ref}
        className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-8 pt-12 pb-4"
      >
        {/* cinematic rain-street visual */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={act1InView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 3, delay: 0.2 }}
          className="w-full max-w-md aspect-[3/2] rounded-2xl mb-8 overflow-hidden"
          style={{ background: 'oklch(0.06 0.015 270)' }}
        >
          <img
            src="/meiqing/scenes/ghibli-phone-window.png"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) saturate(0.7)' }}
          />
        </motion.div>

        {/* time */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={act1InView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-5xl font-extralight tracking-[0.2em] mb-3"
          style={{ color: C.dim, fontFamily: 'var(--font-en)' }}
        >
          01:17
        </motion.p>

        {/* status bar hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={act1InView ? { opacity: 0.4 } : {}}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.5 0.15 140)' }} />
          <span className="text-xs" style={{ color: C.dim, fontFamily: 'var(--font-en)' }}>
            AM · Raining
          </span>
        </motion.div>

        {/* phone screen glow pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={act1InView ? { opacity: [0, 0.15, 0.08, 0.15, 0.1], scale: 1 } : {}}
          transition={{ duration: 4, delay: 1.8, times: [0, 0.2, 0.4, 0.6, 1] }}
          className="w-36 h-56 rounded-3xl mb-10"
          style={{ background: `radial-gradient(ellipse at center, oklch(0.5 0.06 240 / 0.3), transparent 80%)`, border: `1px solid oklch(0.3 0.03 240 / 0.15)` }}
        />

        {/* main text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={act1InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.8, delay: 2.5, ease: [0.25, 1, 0.5, 1] }}
          className="text-center text-lg leading-loose max-w-md"
          style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
        >
          后来，我们开始习惯，<br />在下班后分享生活。
        </motion.p>
      </section>

      {/* ════════════════════════════════════════════════════
          ACT 2 — 记忆漂浮
          ════════════════════════════════════════════════════ */}
      <section ref={act2Ref} className="relative z-10 py-14 px-6 md:px-12">
        {/* section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-center mb-10"
        >
          <span className="meqing-label">记忆漂浮</span>
        </motion.div>

        {/* floating memories — scattered grid, NOT vertical list */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-3xl mx-auto">
          {timeline.map((event, i) => (
            <FloatingMemory
              key={event.date}
              event={event}
              variant={variantMap[i % variantMap.length]}
              index={i}
            />
          ))}
        </div>

        {/* subtle depth blur gradient at bottom */}
        <div
          className="pointer-events-none h-20 mt-8"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.bg})` }}
        />
      </section>

      {/* ════════════════════════════════════════════════════
          ACT 3 — 散落的地点记忆
          ════════════════════════════════════════════════════ */}
      <section ref={act3Ref} className="relative z-10 py-12 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={act3InView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="text-center mb-8"
        >
          <span className="meqing-label">散落的地点</span>
          <p className="text-xs mt-3" style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}>
            那些我们一起去过的地方
          </p>
        </motion.div>

        {/* floating location cards — organic scatter */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-3xl mx-auto">
          {locations.map((loc, i) => (
            <LocationCard key={loc.name} loc={loc} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ACT 4 — 独白
          ════════════════════════════════════════════════════ */}
      <section ref={act4Ref} className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] px-8 py-10">
        {/* atmospheric visual — fading light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={act4InView ? { opacity: 0.7 } : {}}
          transition={{ duration: 4, delay: 0.5 }}
          className="w-48 h-48 mb-8 rounded-full relative"
          style={{ background: `radial-gradient(ellipse at center, oklch(0.15 0.04 55 / 0.3), oklch(0.08 0.02 270 / 0.1) 60%, transparent 80%)` }}
        >
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(ellipse at center, oklch(0.2 0.05 55 / 0.15), transparent 50%)`, animation: 'pulse 8s ease-in-out infinite' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={act4InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="meqing-quote text-center max-w-md"
        >
          有些人，<br />会慢慢变成习惯。
        </motion.p>

        {/* continue button — appears after pause */}
        <AnimatePresence>

        </AnimatePresence>
      </section>
    </div>
  )
}
