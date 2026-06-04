import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FilmGrain from './components/FilmGrain'
import MusicPlayer from './components/MusicPlayer'
import OpeningPrologue from './chapters/OpeningPrologue'
import Cover from './chapters/Cover'
import FirstMeet from './chapters/FirstMeet'
import GettingCloser from './chapters/GettingCloser'

import Confession from './chapters/Confession'
import './meiqing.css'

const CHAPTERS = [Cover, GettingCloser, FirstMeet, Confession]
const CHAPTER_COUNT = CHAPTERS.length

const chapterTransition = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 1.01 },
  transition: {
    duration: 1.2,
    ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
  },
}

/* ─── Edge detection ──────────────────────────────────── */
const EDGE_TOLERANCE = 5

function isNotScrollable(el: HTMLElement): boolean {
  return el.scrollHeight - el.clientHeight <= EDGE_TOLERANCE * 2
}

function isAtTop(el: HTMLElement): boolean {
  return isNotScrollable(el) || el.scrollTop <= EDGE_TOLERANCE
}

function isAtBottom(el: HTMLElement): boolean {
  return isNotScrollable(el) || el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE_TOLERANCE
}

export default function Meiqing() {
  const [prologueDone, setPrologueDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const rootRef = useRef<HTMLDivElement>(null)
  const navigating = useRef(false)
  const contentReady = useRef(true) // default true = no blocking; chapters set false if they need to load

  // Called by chapters when all their content has finished loading
  const onContentReady = useCallback(() => {
    contentReady.current = true
  }, [])

  // Stable callbacks using functional setState (no deps on `current`)
  const goNext = useCallback(() => {
    if (!contentReady.current) return
    setCurrent((c) => {
      if (c < CHAPTER_COUNT - 1) {
        setDirection(1)
        contentReady.current = false // reset for next chapter
        return c + 1
      }
      return c
    })
  }, [])

  const goPrev = useCallback(() => {
    setCurrent((c) => {
      if (c > 0) {
        setDirection(-1)
        contentReady.current = false // reset for prev chapter
        return c - 1
      }
      return c
    })
  }, [])

  /** Find the current chapter scroll container via root */
  const getChapter = useCallback((): HTMLElement | null => {
    return rootRef.current?.querySelector('.meqing-chapter') as HTMLElement | null
  }, [])

  // ─── All navigation listeners on root (event delegation) ───
  const touchRef = useRef<{ y: number; time: number } | null>(null)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Don't attach chapter navigation during prologue
    if (!prologueDone) return

    const root = rootRef.current
    if (!root) return

    // ─── Touch ───
    const onTouchStart = (e: TouchEvent) => {
      touchRef.current = { y: e.touches[0].clientY, time: Date.now() }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchRef.current || navigating.current) return
      const dy = touchRef.current.y - e.changedTouches[0].clientY
      const dt = Date.now() - touchRef.current.time
      touchRef.current = null

      const chapter = getChapter()
      if (!chapter) return

      if (dy > 80 && dt < 800) {
        if (isAtBottom(chapter)) {
          navigating.current = true
          goNext()
          setTimeout(() => { navigating.current = false }, 1500)
        }
      }
      if (dy < -80 && dt < 800) {
        if (isAtTop(chapter)) {
          navigating.current = true
          goPrev()
          setTimeout(() => { navigating.current = false }, 1500)
        }
      }
    }

    // ─── Wheel ───
    const onWheel = (e: WheelEvent) => {
      if (navigating.current) return

      const chapter = getChapter()
      if (!chapter) return

      let delta = e.deltaY
      if (e.deltaMode === 1) delta *= 40
      else if (e.deltaMode === 2) delta *= 800

      if (delta > 0) {
        if (!isAtBottom(chapter)) { wheelAccum.current = 0; return }
      } else {
        if (!isAtTop(chapter)) { wheelAccum.current = 0; return }
      }

      if (wheelTimer.current) clearTimeout(wheelTimer.current)
      wheelAccum.current += delta
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0 }, 300)

      if (Math.abs(wheelAccum.current) > 600) {
        wheelAccum.current = 0
        navigating.current = true
        if (delta > 0) goNext()
        else goPrev()
        setTimeout(() => { navigating.current = false }, 1500)
      }
    }

    // ─── Keyboard ───
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigating.current) return
      const chapter = getChapter()
      if (!chapter) return

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (isAtBottom(chapter)) {
          navigating.current = true
          goNext()
          setTimeout(() => { navigating.current = false }, 1500)
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (isAtTop(chapter)) {
          navigating.current = true
          goPrev()
          setTimeout(() => { navigating.current = false }, 1500)
        }
      }
    }

    root.addEventListener('touchstart', onTouchStart as EventListener, { passive: true })
    root.addEventListener('touchend', onTouchEnd as EventListener, { passive: true })
    root.addEventListener('wheel', onWheel as EventListener, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      root.removeEventListener('touchstart', onTouchStart as EventListener)
      root.removeEventListener('touchend', onTouchEnd as EventListener)
      root.removeEventListener('wheel', onWheel as EventListener)
      window.removeEventListener('keydown', onKeyDown)
      if (wheelTimer.current) clearTimeout(wheelTimer.current)
    }
  }, [prologueDone, goNext, goPrev, getChapter])

  const ChapterComponent = CHAPTERS[current]

  return (
    <div className="meqing-root" ref={rootRef}>
      <FilmGrain />
      <MusicPlayer />

      {/* Opening Prologue — gate before chapters */}
      <AnimatePresence>
        {!prologueDone && (
          <motion.div
            key="prologue"
            className="meqing-chapter"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <OpeningPrologue onNext={() => setPrologueDone(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter story — only after prologue is completed */}
      {prologueDone && (
        <>
          {/* Progress dots */}
          <div className="meqing-progress" aria-hidden="true">
            {Array.from({ length: CHAPTER_COUNT }, (_, i) => (
              <div key={i} className={`meqing-dot ${i === current ? 'active' : ''}`} />
            ))}
          </div>

          {/* Chapter content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={chapterTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={chapterTransition.transition}
              className="meqing-chapter"
            >
              <ChapterComponent onNext={goNext} onContentReady={onContentReady} />
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
