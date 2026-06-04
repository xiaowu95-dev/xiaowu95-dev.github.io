import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { TimelineEvent } from '../memories'

interface EnhancedTimelineProps {
  events: TimelineEvent[]
}

const iconPaths: Record<string, string> = {
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  food: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
  walk: 'M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 21l3-7 2.5 3V21h2v-6.5L12 12l1-4c1.1 0 2.7.5 3.5 1.5L18 11h2l-2.5-4C16.3 5.8 14.4 5 12.5 5c-.5 0-1 .1-1.5.2L7 7v2l3-1-2 5H6v2h3l1.5-3L7 21z',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z',
  photo: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

/* Warm accent per icon type */
const iconAccents: Record<string, { bg: string; glow: string; stroke: string; line: string }> = {
  heart: { bg: 'oklch(0.22 0.06 10 / 0.4)', glow: 'oklch(0.55 0.12 15 / 0.15)', stroke: 'oklch(0.75 0.14 20)', line: 'oklch(0.55 0.08 15 / 0.2)' },
  chat:  { bg: 'oklch(0.18 0.05 260 / 0.4)', glow: 'oklch(0.45 0.08 270 / 0.1)', stroke: 'oklch(0.68 0.10 270)', line: 'oklch(0.40 0.06 270 / 0.2)' },
  food:  { bg: 'oklch(0.22 0.06 55 / 0.4)',  glow: 'oklch(0.50 0.10 60 / 0.1)',  stroke: 'oklch(0.72 0.12 60)',  line: 'oklch(0.50 0.07 55 / 0.2)' },
  walk:  { bg: 'oklch(0.20 0.05 140 / 0.4)', glow: 'oklch(0.45 0.08 150 / 0.1)', stroke: 'oklch(0.65 0.10 150)', line: 'oklch(0.40 0.06 140 / 0.2)' },
  gift:  { bg: 'oklch(0.24 0.07 320 / 0.4)', glow: 'oklch(0.55 0.12 330 / 0.12)', stroke: 'oklch(0.78 0.14 330)', line: 'oklch(0.50 0.08 320 / 0.2)' },
  photo: { bg: 'oklch(0.20 0.05 85 / 0.4)',  glow: 'oklch(0.50 0.10 85 / 0.1)',  stroke: 'oklch(0.72 0.13 85)',  line: 'oklch(0.45 0.07 85 / 0.2)' },
  music: { bg: 'oklch(0.20 0.05 280 / 0.4)', glow: 'oklch(0.45 0.08 290 / 0.1)', stroke: 'oklch(0.65 0.10 290)', line: 'oklch(0.40 0.06 280 / 0.2)' },
  star:  { bg: 'oklch(0.22 0.06 85 / 0.4)',  glow: 'oklch(0.55 0.12 85 / 0.15)', stroke: 'oklch(0.72 0.13 85)',  line: 'oklch(0.50 0.08 85 / 0.2)' },
}

function TimelineEntry({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const accent = iconAccents[event.icon] || iconAccents.star

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="relative flex gap-4 items-start"
    >
      {/* Timeline track */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        {/* Glow behind icon */}
        <div
          className="absolute rounded-full"
          style={{
            width: '2rem',
            height: '2rem',
            background: accent.glow,
            filter: 'blur(6px)',
            top: 0,
          }}
        />
        {/* Icon circle */}
        <div
          className="relative w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: accent.bg,
            border: `1px solid ${accent.line}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPaths[event.icon] || iconPaths.star} />
          </svg>
        </div>
        {/* Connecting line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 min-h-[1rem]"
            style={{ background: `linear-gradient(to bottom, ${accent.line}, transparent)` }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="flex-1 pb-6 min-w-0"
        style={{
          background: 'oklch(0.10 0.015 270 / 0.25)',
          border: '1px solid oklch(0.22 0.03 270 / 0.15)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          backdropFilter: 'blur(6px)',
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: index * 0.08 + 0.1,
          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        }}
      >
        {/* Date pill */}
        <span
          className="inline-block text-xs tracking-wider px-2 py-0.5 rounded-full mb-1.5"
          style={{
            color: accent.stroke,
            background: `${accent.bg}`,
            border: `1px solid ${accent.line}`,
            fontFamily: 'var(--font-en, serif)',
            letterSpacing: '0.08em',
          }}
        >
          {event.date}
        </span>
        <p
          className="text-sm font-semibold mb-0.5"
          style={{ color: 'oklch(0.94 0.015 80)' }}
        >
          {event.title}
        </p>
        <p
          className="meqing-text text-sm leading-relaxed"
          style={{ color: 'oklch(0.78 0.012 75)', opacity: 0.8 }}
        >
          {event.description}
        </p>

        {/* Optional photo */}
        {event.photo && (
          <div
            className="mt-3 w-full max-w-xs aspect-[4/3] rounded-md overflow-hidden"
            style={{
              background: `oklch(0.15 0.03 ${280 + index * 10} / 0.3)`,
              border: '1px solid oklch(0.25 0.04 55 / 0.12)',
            }}
          >
            <img
              src={event.photo}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function EnhancedTimeline({ events }: EnhancedTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <TimelineEntry key={i} event={event} index={i} isLast={i === events.length - 1} />
      ))}
    </div>
  )
}
