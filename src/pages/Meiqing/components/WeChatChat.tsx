import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { ChatMessage } from '../memories'

interface WeChatChatProps {
  messages: ChatMessage[]
  /** Show "first time" milestone badge? */
  showMilestones?: boolean
}

function ChatBubble({
  msg,
  index,
  showMilestones,
}: {
  msg: ChatMessage
  index: number
  showMilestones?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const isMe = msg.from === 'me'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="flex flex-col gap-1"
    >
      {/* Milestone badge */}
      {showMilestones && msg.milestone && (
        <div className="flex justify-center mb-2">
          <span
            className="px-3 py-1 rounded-full text-xs"
            style={{
              background: 'oklch(0.72 0.13 85 / 0.12)',
              color: 'oklch(0.72 0.13 85)',
              fontFamily: 'var(--font-en, serif)',
              letterSpacing: '0.06em',
            }}
          >
            {msg.milestone}
          </span>
        </div>
      )}

      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        {/* Avatar */}
        {!isMe && (
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs"
            style={{
              background: 'oklch(0.25 0.06 295 / 0.5)',
              color: 'oklch(0.78 0.04 85)',
              fontFamily: 'var(--font-en, serif)',
            }}
          >
            她
          </div>
        )}

        <div className="flex flex-col max-w-[70%]">
          {/* Bubble */}
          <div
            className="px-3.5 py-2.5 text-sm leading-relaxed"
            style={{
              borderRadius: isMe ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
              background: isMe
                ? 'oklch(0.35 0.06 295 / 0.45)'
                : 'oklch(0.18 0.025 270 / 0.85)',
              color: 'oklch(0.92 0.015 80)',
            }}
          >
            {msg.text}
          </div>

          {/* Timestamp */}
          <span
            className="text-xs mt-1 px-1 opacity-25"
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
            className="w-8 h-8 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-xs"
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

export default function WeChatChat({ messages, showMilestones = true }: WeChatChatProps) {
  return (
    <div
      className="rounded-xl p-4 md:p-5 space-y-3"
      style={{
        background: 'oklch(0.10 0.02 270 / 0.5)',
        border: '1px solid oklch(0.25 0.03 270 / 0.3)',
      }}
    >
      {/* WeChat-style header */}
      <div
        className="flex items-center gap-2 pb-3 mb-2"
        style={{ borderBottom: '1px solid oklch(0.25 0.03 270 / 0.2)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'oklch(0.55 0.10 130)' }}
        />
        <span
          className="text-xs opacity-40"
          style={{ color: 'oklch(0.7 0.03 270)' }}
        >
          微信聊天记录
        </span>
      </div>

      {messages.map((msg, i) => (
        <ChatBubble key={i} msg={msg} index={i} showMilestones={showMilestones} />
      ))}
    </div>
  )
}
