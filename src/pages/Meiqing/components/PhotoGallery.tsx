import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import type { PhotoMemory } from '../memories'

interface PhotoMemoryProps {
  photos: PhotoMemory[]
}

function PhotoCard({ photo, index }: { photo: PhotoMemory; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="group relative"
    >
      <div
        className="overflow-hidden relative"
        style={{
          aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '1/1' : '3/4',
          borderRadius: '0.375rem',
          border: '1px solid oklch(0.3 0.04 55 / 0.15)',
        }}
      >
        {/* Photo or placeholder */}
        {!errored ? (
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : null}

        {/* Placeholder when image hasn't loaded or is missing */}
        {(!loaded || errored) && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, oklch(0.18 0.04 ${45 + index * 15}) 0%, oklch(0.12 0.03 ${260 + index * 8}) 100%)`,
            }}
          >
            <div className="text-center opacity-25">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(0.75 0.04 55)"
                strokeWidth="1"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <circle cx="8" cy="8" r="2" />
                <path d="M2 16l5-5 3 3 4-4 8 8" />
              </svg>
            </div>
          </div>
        )}

        {/* Film vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 60px oklch(0.08 0.02 40 / 0.35)',
          }}
        />

        {/* Caption overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3"
          style={{
            background: 'linear-gradient(transparent, oklch(0.06 0.012 270 / 0.8))',
          }}
        >
          <p
            className="text-sm leading-snug"
            style={{ color: 'oklch(0.92 0.015 80)' }}
          >
            {photo.caption}
          </p>
          <p
            className="text-xs mt-1 opacity-40"
            style={{
              color: 'oklch(0.7 0.04 55)',
              fontFamily: 'var(--font-en, serif)',
            }}
          >
            {photo.date}{photo.location ? ` · ${photo.location}` : ''}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function PhotoGallery({ photos }: PhotoMemoryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {photos.map((photo, i) => (
        <PhotoCard key={i} photo={photo} index={i} />
      ))}
    </div>
  )
}
