import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from '../memories'

interface SequentialChatProps {
  messages: ChatMessage[]
  /** Base delay between messages (ms) */
  baseDelay?: number
  /** Callback when all messages have appeared */
  onComplete?: () => void
  /** Start the animation? */
  active?: boolean
}

function TypingIndicator({ from }: { from: 'me' | 'you' }) {
  const isMe = from === 'me'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      {!isMe && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs"
          style={{
            background: 'oklch(0.25 0.06 295 / 0.5)',
            color: 'oklch(0.78 0.04 85)',
            fontFamily: 'var(--font-en, serif)',
          }}
        >
          箐
        </div>
      )}
      <div
        className="px-3.5 py-2.5 rounded-2xl flex items-center gap-1"
        style={{
          background: isMe ? 'oklch(0.35 0.06 295 / 0.3)' : 'oklch(0.18 0.025 270 / 0.7)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'oklch(0.6 0.03 270)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {isMe && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-xs"
          style={{
            background: 'oklch(0.30 0.06 130 / 0.4)',
            color: 'oklch(0.72 0.08 85)',
            fontFamily: 'var(--font-en, serif)',
          }}
        >
          我
        </div>
      )}
    </motion.div>
  )
}

function ChatBubble({ msg }: { msg: ChatMessage; index: number }) {
  const isMe = msg.from === 'me'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="flex flex-col gap-0.5"
    >
      {/* Milestone badge */}
      {msg.milestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-2"
        >
          <span
            className="px-3 py-1 rounded-full text-xs"
            style={{
              background: 'oklch(0.72 0.13 85 / 0.1)',
              color: 'oklch(0.72 0.13 85 / 0.8)',
              fontFamily: 'var(--font-en, serif)',
              letterSpacing: '0.06em',
            }}
          >
            {msg.milestone}
          </span>
        </motion.div>
      )}

      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && (
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs"
            style={{
              background: 'oklch(0.25 0.06 295 / 0.5)',
              color: 'oklch(0.78 0.04 85)',
              fontFamily: 'var(--font-en, serif)',
            }}
          >
            箐
          </div>
        )}

        <div className="flex flex-col max-w-[72%]">
          <div
            className="px-3.5 py-2.5 text-sm leading-relaxed"
            style={{
              borderRadius: isMe ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
              background: isMe
                ? 'oklch(0.35 0.06 295 / 0.4)'
                : 'oklch(0.18 0.025 270 / 0.85)',
              color: 'oklch(0.92 0.015 80)',
            }}
          >
            {msg.text}
          </div>
          <span
            className="text-xs mt-0.5 px-1 opacity-20"
            style={{
              textAlign: isMe ? 'right' : 'left',
              color: 'oklch(0.7 0.03 270)',
            }}
          >
            {msg.time}
          </span>
        </div>

        {isMe && (
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-xs"
            style={{
              background: 'oklch(0.30 0.06 130 / 0.4)',
              color: 'oklch(0.72 0.08 85)',
              fontFamily: 'var(--font-en, serif)',
            }}
          >
            我
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function SequentialChat({
  messages,
  baseDelay = 1800,
  onComplete,
  active = true,
}: SequentialChatProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [typingFrom, setTypingFrom] = useState<'me' | 'you'>('you')

  const advance = useCallback(() => {
    if (!active) return

    if (visibleCount >= messages.length) {
      onComplete?.()
      return
    }

    const nextMsg = messages[visibleCount]
    setTypingFrom(nextMsg.from)
    setShowTyping(true)

    // Typing indicator shows for a bit, then the message appears
    const typingDuration = Math.max(600, Math.min(nextMsg.text.length * 80, 1600))

    const typingTimer = setTimeout(() => {
      setShowTyping(false)
      setVisibleCount((c) => c + 1)
    }, typingDuration)

    return () => clearTimeout(typingTimer)
  }, [active, visibleCount, messages, onComplete])

  // Start the sequence when active becomes true
  useEffect(() => {
    if (!active) return

    // Initial delay before first message
    const startTimer = setTimeout(() => {
      advance()
    }, 1200)

    return () => clearTimeout(startTimer)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  // Continue the sequence after each new message
  useEffect(() => {
    if (!active || visibleCount === 0) return
    if (visibleCount >= messages.length) {
      onComplete?.()
      return
    }

    // Variable delay between messages — shorter for quick exchanges
    const prevMsg = messages[visibleCount - 1]
    const nextMsg = messages[visibleCount]
    const isRapid = prevMsg.time === nextMsg.time
    const delay = isRapid ? baseDelay * 0.5 : baseDelay

    const timer = setTimeout(() => {
      advance()
    }, delay)

    return () => clearTimeout(timer)
  }, [visibleCount, active]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'oklch(0.08 0.015 270 / 0.6)',
        border: '1px solid oklch(0.2 0.02 270 / 0.3)',
        boxShadow: '0 12px 40px oklch(0.04 0.01 270 / 0.4)',
      }}
    >
      {/* WeChat dark-mode header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid oklch(0.2 0.02 270 / 0.25)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.6 0.03 270)" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-sm" style={{ color: 'oklch(0.85 0.015 80)' }}>贺美箐</span>
        </div>
        <span className="text-xs opacity-30" style={{ color: 'oklch(0.6 0.03 270)' }}>22:17</span>
      </div>

      {/* Chat area */}
      <div className="px-4 py-4 space-y-3 min-h-[280px]">
        {/* Date separator */}
        <div className="flex justify-center mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: 'oklch(0.15 0.02 270 / 0.5)',
              color: 'oklch(0.5 0.02 270)',
            }}
          >
            昨天 22:17
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.slice(0, visibleCount).map((msg, i) => (
            <ChatBubble key={i} msg={msg} index={i} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {showTyping && <TypingIndicator from={typingFrom} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
