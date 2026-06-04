import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/6bc8k-bbkkt.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        // Autoplay blocked, user needs to interact first
      })
    }
    setPlaying(!playing)
  }, [playing])

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300"
      style={{
        background: playing
          ? 'oklch(0.2 0.03 295 / 0.6)'
          : 'oklch(0.15 0.02 270 / 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid oklch(0.4 0.04 85 / 0.2)',
      }}
      whileTap={{ scale: 0.9 }}
      aria-label={playing ? '暂停音乐' : '播放音乐'}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.svg
            key="pause"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="oklch(0.72 0.13 85)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </motion.svg>
        ) : (
          <motion.svg
            key="play"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="oklch(0.72 0.13 85)"
          >
            <polygon points="6,3 20,12 6,21" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Sound wave animation when playing */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid oklch(0.72 0.13 85 / 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid oklch(0.72 0.13 85 / 0.15)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
