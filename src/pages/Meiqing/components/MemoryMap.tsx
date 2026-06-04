import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Location } from '../memories'

interface MemoryMapProps {
  locations: Location[]
}

function LocationPin({ location, index }: { location: Location; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="relative pl-8 pb-8"
    >
      {/* Connecting line */}
      {index < 4 && (
        <div
          className="absolute left-[11px] top-5 bottom-0 w-px"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.72 0.13 85 / 0.3), transparent)',
          }}
        />
      )}

      {/* Pin dot */}
      <div
        className="absolute left-1 top-1.5 w-3 h-3 rounded-full"
        style={{
          background: 'oklch(0.72 0.13 85)',
          boxShadow: '0 0 8px oklch(0.72 0.13 85 / 0.3)',
        }}
      />

      {/* Content */}
      <div>
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: 'oklch(0.72 0.13 85)' }}
        >
          {location.name}
        </p>
        <p
          className="meqing-text text-sm mb-1"
          style={{ color: 'oklch(0.85 0.015 75)' }}
        >
          {location.memory}
        </p>
        <p
          className="text-xs opacity-30"
          style={{
            color: 'oklch(0.7 0.03 270)',
            fontFamily: 'var(--font-en, serif)',
          }}
        >
          {location.date}
        </p>
      </div>
    </motion.div>
  )
}

export default function MemoryMap({ locations }: MemoryMapProps) {
  return (
    <div
      className="rounded-xl p-5 md:p-6 relative overflow-hidden"
      style={{
        background: 'oklch(0.08 0.02 270 / 0.4)',
        border: '1px solid oklch(0.25 0.03 270 / 0.2)',
      }}
    >
      {/* Map-like decorative background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.5 0.02 270) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.5 0.02 270) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="oklch(0.72 0.13 85)"
          strokeWidth="1.5"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span
          className="text-xs tracking-wider"
          style={{
            color: 'oklch(0.65 0.08 82)',
            fontFamily: 'var(--font-en, serif)',
            letterSpacing: '0.12em',
          }}
        >
          我们的地图
        </span>
      </div>

      {/* Location list */}
      <div className="relative z-10">
        {locations.map((loc, i) => (
          <LocationPin key={i} location={loc} index={i} />
        ))}
      </div>
    </div>
  )
}
