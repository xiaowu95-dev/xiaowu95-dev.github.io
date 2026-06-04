import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { firstChats } from '../memories'
import XiaohongshuPost from '../components/XiaohongshuPost'
import SequentialChat from '../components/SequentialChat'

interface GettingCloserProps {
  onNext: () => void
  onContentReady?: () => void
}

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  )
}

export default function GettingCloser({ onContentReady }: GettingCloserProps) {
  const [chatActive, setChatActive] = useState(false)
  const [chatComplete, setChatComplete] = useState(false)
  const [showPost, setShowPost] = useState(false)
  const [showReflection, setShowReflection] = useState(false)

  // Staggered reveal sequence for the opening
  useEffect(() => {
    const t1 = setTimeout(() => setShowPost(true), 2400)
    const t2 = setTimeout(() => setChatActive(true), 5800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // After chat completes, show the reflection text
  useEffect(() => {
    if (chatComplete) {
      const t = setTimeout(() => setShowReflection(true), 800)
      return () => clearTimeout(t)
    }
  }, [chatComplete])

  // Notify parent when all content has finished loading
  useEffect(() => {
    if (showReflection && onContentReady) {
      onContentReady()
    }
  }, [showReflection, onContentReady])

  return (
    <div
      className="relative w-full min-h-full"
      style={{
        background:
          'linear-gradient(180deg, oklch(0.06 0.012 270) 0%, oklch(0.10 0.025 260) 30%, oklch(0.13 0.04 270) 60%, oklch(0.16 0.05 280) 100%)',
      }}
    >
      {/* Late-night ambient */}
      <div
        className="absolute top-1/4 left-1/3 w-2/3 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, oklch(0.18 0.04 295 / 0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-24">
        {/* Chapter label */}
        <RevealText>
          <h2
            className="text-2xl md:text-3xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-cn, serif)', color: 'oklch(0.94 0.015 80)' }}
          >
            初识
          </h2>
        </RevealText>

        {/* ── Opening cinematic text ── */}
        <RevealText delay={0.3}>
          <p
            className="meqing-text meqing-text-lg mb-2"
            style={{ color: 'oklch(0.85 0.015 75)' }}
          >
            两个原本毫无交集的人，
          </p>
        </RevealText>
        <RevealText delay={0.6}>
          <p
            className="meqing-text meqing-text-lg mb-2"
            style={{ color: 'oklch(0.85 0.015 75)' }}
          >
            因为小红书上的一篇帖子，
          </p>
        </RevealText>
        <RevealText delay={0.9}>
          <p
            className="meqing-text meqing-text-lg mb-12"
            style={{ color: 'oklch(0.85 0.015 75)' }}
          >
            意外开始了故事。
          </p>
        </RevealText>

        {/* ── Transition line ── */}
        <RevealText delay={1.6}>
          <p
            className="meqing-quote text-center mb-10 max-w-lg mx-auto"
            style={{ color: 'oklch(0.94 0.02 80)', fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)' }}
          >
            后来我才发现，有些故事的开始，只是因为一次再普通不过的消息。
          </p>
        </RevealText>

        {/* ── Xiaohongshu post ── */}
        <div className="mb-14 flex justify-center">
          <XiaohongshuPost visible={showPost} />
        </div>

        {/* ── Section label before chat ── */}
        <AnimatePresence>
          {chatActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <p
                className="meqing-label text-center mb-3"
              >
                我们随后加了好友
              </p>
              <div className="w-8 h-px mx-auto mb-6" style={{ background: 'oklch(0.72 0.13 85 / 0.25)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sequential WeChat chat (the core) ── */}
        <div className="max-w-md mx-auto mb-8">
          <SequentialChat
            messages={firstChats}
            baseDelay={2000}
            active={chatActive}
            onComplete={() => setChatComplete(true)}
          />
        </div>

        {/* ── Post-chat reflection ── */}
        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              className="text-center max-w-lg mx-auto mb-8"
            >
              <p
                className="meqing-text meqing-text-lg"
                style={{ color: 'oklch(0.75 0.012 75)', opacity: 0.5 }}
              >
                那时候的我们都不知道，原来这会是故事的开始。
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>


    </div>
  )
}
