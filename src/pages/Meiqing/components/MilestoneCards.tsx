import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { WeChatMilestone } from '../memories'

interface MilestoneCardsProps {
  milestones: WeChatMilestone[]
}

const milestoneIcons: Record<string, string> = {
  'first-goodmorning': '☀',
  'first-goodnight': '☽',
  'first-miss': '♡',
  'first-love': '♥',
  'first-date': '♩',
  'first-gift': '✦',
  'first-fight': '⚡',
  'first-apology': '✿',
}

function MilestoneCard({ milestone, index }: { milestone: WeChatMilestone; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const isMe = milestone.from === 'me'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="flex gap-4 items-start"
    >
      {/* Icon badge */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{
          background: 'oklch(0.15 0.04 295 / 0.5)',
          border: '1px solid oklch(0.35 0.06 295 / 0.3)',
        }}
      >
        {milestoneIcons[milestone.icon] || '✦'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs tracking-wider mb-1.5"
          style={{
            color: 'oklch(0.72 0.13 85)',
            fontFamily: 'var(--font-en, serif)',
            letterSpacing: '0.1em',
          }}
        >
          {milestone.label}
        </p>
        <div
          className="px-3 py-2.5 rounded-lg text-sm inline-block max-w-full"
          style={{
            background: isMe
              ? 'oklch(0.35 0.06 295 / 0.3)'
              : 'oklch(0.18 0.025 270 / 0.6)',
            color: 'oklch(0.92 0.015 80)',
            borderRadius: isMe ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
          }}
        >
          {milestone.content}
        </div>
        <p
          className="text-xs mt-1.5 opacity-25"
          style={{
            color: 'oklch(0.7 0.03 270)',
            fontFamily: 'var(--font-en, serif)',
          }}
        >
          {milestone.date} · {isMe ? '我' : '她'}
        </p>
      </div>
    </motion.div>
  )
}

export default function MilestoneCards({ milestones }: MilestoneCardsProps) {
  return (
    <div
      className="rounded-xl p-5 md:p-6 space-y-5"
      style={{
        background: 'oklch(0.08 0.02 270 / 0.4)',
        border: '1px solid oklch(0.25 0.03 270 / 0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid oklch(0.25 0.03 270 / 0.15)' }}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="oklch(0.72 0.13 85)"
          strokeWidth="1.5"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span
          className="text-xs tracking-wider"
          style={{
            color: 'oklch(0.65 0.08 82)',
            fontFamily: 'var(--font-en, serif)',
            letterSpacing: '0.12em',
          }}
        >
          微信里程碑
        </span>
      </div>

      {milestones.map((ms, i) => (
        <MilestoneCard key={i} milestone={ms} index={i} />
      ))}
    </div>
  )
}
