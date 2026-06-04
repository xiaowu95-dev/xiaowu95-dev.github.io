import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import StarField from '../components/StarField'
import FloatingParticles from '../components/FloatingParticles'
import { useGsapVisibilityPause } from '../components/useGsapVisibilityPause'

interface ConfessionProps {
  onNext: () => void
  onContentReady?: () => void
}

/* ─── color tokens — invitation palette ──────────────── */
const C = {
  bg: 'oklch(0.04 0.008 270)',
  gold: 'oklch(0.78 0.10 85)',
  goldLight: 'oklch(0.88 0.06 85)',
  goldDim: 'oklch(0.55 0.08 85)',
  warm: 'oklch(0.94 0.015 80)',
  dim: 'oklch(0.60 0.01 75)',
  glass: 'oklch(0.07 0.01 270 / 0.65)',
}

/* ─── high德地图 navigation ──────────────────────────── */
const RESTAURANT = '盐和炭火·烧鸟·居酒屋(高新店)'
const CITY = '大连'

function openNavigation() {
  const name = encodeURIComponent(RESTAURANT)
  const city = encodeURIComponent(CITY)
  const webUrl = `https://uri.amap.com/search?keyword=${name}&city=${city}&src=meiqing`

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIOS) {
    window.location.href = `iosamap://search?sourceApplication=meiqing&keyword=${name}&city=${city}`
    setTimeout(() => window.open(webUrl, '_blank'), 1500)
  } else if (isAndroid) {
    window.location.href = `androidamap://search?sourceApplication=meiqing&keyword=${name}&city=${city}`
    setTimeout(() => window.open(webUrl, '_blank'), 1500)
  } else {
    window.open(webUrl, '_blank')
  }
}

/* ─── easing curve ───────────────────────────────────── */
const E = [0.25, 1, 0.5, 1] as [number, number, number, number]

/* ═══════════════════════════════════════════════════════
   Chapter IV — Invitation（邀请）
   "我想见你。" 不是告白，是认真地邀请你来赴一场约。
   ═══════════════════════════════════════════════════════ */
export default function Confession({ onContentReady }: ConfessionProps) {
  const [showRoute, setShowRoute] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)
  const hasScrolled = useRef(false)

  useGsapVisibilityPause()

  /* track manual scroll */
  useEffect(() => {
    const el = document.querySelector('.meqing-chapter')
    if (!el) return
    const onScroll = () => { hasScrolled.current = true }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  /* auto-scroll to card area before it appears */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasScrolled.current && cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 4500)
    return () => clearTimeout(t)
  }, [])

  /* route button + continue appear after card content finishes */
  useEffect(() => {
    const t1 = setTimeout(() => setShowRoute(true), 11500)
    const t2 = setTimeout(() => onContentReady?.(), 12000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onContentReady])

  /* GSAP gold shimmer sweep across card */
  useEffect(() => {
    const t = setTimeout(() => {
      if (shimmerRef.current) {
        gsap.to(shimmerRef.current, {
          backgroundPosition: '200% center',
          duration: 6,
          ease: 'none',
          repeat: -1,
        })
      }
    }, 8500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="meqing-chapter-inner relative min-h-screen overflow-y-auto overflow-x-hidden"
      style={{ background: C.bg, color: C.warm }}
    >
      {/* film grain */}
      <div className="meqing-grain pointer-events-none absolute inset-0 z-50" />

      {/* starfield — sparse, quiet */}
      <StarField count={60} />

      {/* floating dust motes in gold */}
      <FloatingParticles count={8} color={C.gold} speed={0.06} />

      {/* ambient gold light — like a distant lamp */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[400px] h-[500px] opacity-[0.04]"
          style={{ background: `radial-gradient(ellipse at center, ${C.gold}, transparent 70%)` }}
        />
        {/* very faint warm floor light */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] opacity-[0.02]"
          style={{ background: `radial-gradient(ellipse at bottom center, ${C.gold}, transparent 70%)` }}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          Content
          ═══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center min-h-screen pt-28 md:pt-36 pb-24 px-6">

        {/* ─── Opening text ─── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.8, ease: E }}
          className="meqing-text text-center mb-16"
          style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
        >
          有些话，<br />想当面告诉你。
        </motion.p>

        {/* ─── Invitation card ─── */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 5, duration: 2.5, ease: E }}
          className="relative max-w-sm w-full"
        >
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              background: C.glass,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid oklch(0.78 0.10 85 / 0.2)`,
              boxShadow: `
                0 0 0 1px oklch(0.78 0.10 85 / 0.04),
                0 4px 16px oklch(0.02 0.01 270 / 0.3),
                0 20px 60px oklch(0.02 0.01 270 / 0.5),
                inset 0 1px 0 oklch(0.78 0.10 85 / 0.06)
              `,
            }}
          >
            {/* gold shimmer overlay */}
            <div
              ref={shimmerRef}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `linear-gradient(
                  105deg,
                  transparent 40%,
                  oklch(0.78 0.10 85 / 0.03) 44%,
                  oklch(0.78 0.10 85 / 0.07) 50%,
                  oklch(0.78 0.10 85 / 0.03) 56%,
                  transparent 60%
                )`,
                backgroundSize: '200% 100%',
                backgroundPosition: '0% center',
              }}
            />

            {/* paper warm spots */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `
                  radial-gradient(ellipse at 25% 20%, oklch(0.78 0.10 85 / 0.008) 0%, transparent 50%),
                  radial-gradient(ellipse at 75% 80%, oklch(0.78 0.10 85 / 0.008) 0%, transparent 50%)
                `,
              }}
            />

            {/* ─── Card content ─── */}
            <div className="relative z-20 px-8 py-10 md:px-10 md:py-12">

              {/* To: */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 7, duration: 1.2, ease: E }}
                className="text-xs tracking-[0.25em] uppercase mb-1"
                style={{ color: C.gold, fontFamily: 'var(--font-en)' }}
              >
                To
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 7.3, duration: 1.2, ease: E }}
                className="text-xl font-medium mb-7"
                style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
              >
                贺美箐
              </motion.p>

              {/* gold divider — grows from left */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 7.8, duration: 1.5, ease: E }}
                className="h-px mb-7 origin-left"
                style={{ background: `linear-gradient(to right, ${C.gold}, oklch(0.78 0.10 85 / 0.08))` }}
              />

              {/* invitation body */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 8.2, duration: 1.2, ease: E }}
                className="text-base leading-loose mb-1.5"
                style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
              >
                我想邀请你，
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 8.6, duration: 1.2, ease: E }}
                className="text-base leading-loose mb-1.5"
                style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
              >
                在{' '}
                <span style={{ color: C.goldLight }}>6 月 5 日</span>
                {' '}晚上{' '}
                <span style={{ color: C.goldLight }}>6:00</span>
                ，
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 9, duration: 1.2, ease: E }}
                className="text-base leading-loose mb-7"
                style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
              >
                赴一场属于我们的晚餐。
              </motion.p>

              {/* gold divider — grows from left */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 9.5, duration: 1.5, ease: E }}
                className="h-px mb-7 origin-left"
                style={{ background: `linear-gradient(to right, ${C.gold}, oklch(0.78 0.10 85 / 0.08))` }}
              />

              {/* location */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 10, duration: 1, ease: E }}
                className="text-xs tracking-wider mb-1"
                style={{ color: C.dim, fontFamily: 'var(--font-cn)' }}
              >
                地点
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 10.3, duration: 1.2, ease: E }}
                className="text-base font-medium leading-relaxed mb-7"
                style={{ color: C.warm, fontFamily: 'var(--font-cn)' }}
              >
                盐和炭火·烧鸟·居酒屋（高新店）
              </motion.p>

              {/* center divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 10.8, duration: 1.5, ease: E }}
                className="h-px mb-7 origin-center"
                style={{ background: `linear-gradient(to right, transparent, ${C.gold} 30%, ${C.gold} 70%, transparent)` }}
              />

              {/* closing line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 11.2, duration: 1.5, ease: E }}
                className="text-sm text-center italic leading-relaxed"
                style={{ color: C.goldDim, fontFamily: 'var(--font-cn)' }}
              >
                希望那天，你会如约而至。
              </motion.p>
            </div>
          </div>

          {/* card outer glow — like light spilling from the card */}
          <div
            className="absolute -inset-4 pointer-events-none -z-10 opacity-[0.04]"
            style={{ background: `radial-gradient(ellipse at center, ${C.gold}, transparent 70%)` }}
          />
        </motion.div>

        {/* ─── Route button ─── */}
        <AnimatePresence>
          {showRoute && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: E }}
              onClick={openNavigation}
              className="route-btn mt-10 px-6 py-2.5 rounded-full text-sm tracking-wider"
              style={{ fontFamily: 'var(--font-cn)' }}
            >
              查看路线
            </motion.button>
          )}
        </AnimatePresence>
      </div>



      {/* Route button styles */}
      <style>{`
        .route-btn {
          background: transparent;
          border: 1px solid oklch(0.78 0.10 85 / 0.2);
          color: oklch(0.88 0.06 85);
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .route-btn:hover {
          border-color: oklch(0.78 0.10 85 / 0.45);
          box-shadow: 0 0 24px oklch(0.78 0.10 85 / 0.08);
        }
        .route-btn:active {
          border-color: oklch(0.78 0.10 85 / 0.6);
          box-shadow: 0 0 32px oklch(0.78 0.10 85 / 0.12);
        }
      `}</style>
    </div>
  )
}
