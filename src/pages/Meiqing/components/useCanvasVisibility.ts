import { useEffect, useRef, useCallback } from 'react'

/**
 * Hook that pauses canvas animation loops when:
 * 1. The browser tab is hidden (document.hidden)
 * 2. The canvas element is scrolled out of viewport (IntersectionObserver)
 *
 * Returns:
 * - `canvasRef` — attach to the <canvas> element
 * - `isVisible` — reactive boolean (false when hidden/off-screen)
 * - `scheduleFrame` — replacement for raw requestAnimationFrame;
 *   automatically cancels pending frames when visibility changes
 */
export function useCanvasVisibility() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useRef(true)
  const rafRef = useRef<number>(0)

  // ─── document.hidden ───
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
        visibleRef.current = false
      } else {
        visibleRef.current = true
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // ─── IntersectionObserver ───
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(rafRef.current)
          visibleRef.current = false
        } else {
          visibleRef.current = true
        }
      },
      { threshold: 0 } // even 1px visible counts
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /** Call instead of requestAnimationFrame. Stores the id for auto-cleanup. */
  const scheduleFrame = useCallback((cb: FrameRequestCallback) => {
    rafRef.current = requestAnimationFrame(cb)
    return rafRef.current
  }, [])

  /** Cancel any pending frame */
  const cancelFrame = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  return { canvasRef, visibleRef, scheduleFrame, cancelFrame, rafRef }
}
