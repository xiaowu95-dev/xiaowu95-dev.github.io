import { useCallback, useEffect, useRef } from 'react'
import { useCanvasVisibility } from './useCanvasVisibility'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
  warmth: string
}

interface StarFieldProps {
  count?: number
  className?: string
}

export default function StarField({ count = 180, className = '' }: StarFieldProps) {
  const { canvasRef, visibleRef, scheduleFrame, cancelFrame } = useCanvasVisibility()
  const starsRef = useRef<Star[]>([])

  const initStars = useCallback(
    (width: number, height: number) => {
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        warmth: Math.random() > 0.7 ? 'oklch(0.9 0.04 85)' : 'oklch(0.88 0.02 260)',
      }))
    },
    [count],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initStars(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const draw = () => {
      if (!visibleRef.current) {
        scheduleFrame(draw)
        return
      }

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
        const alpha = star.opacity * (0.4 + twinkle * 0.6)
        const r = star.size * (0.8 + twinkle * 0.2)

        ctx.beginPath()
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2)
        ctx.fillStyle = star.warmth
        ctx.globalAlpha = alpha
        ctx.fill()

        // Subtle glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, r * 3, 0, Math.PI * 2)
          ctx.fillStyle = star.warmth
          ctx.globalAlpha = alpha * 0.08
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      time++
      scheduleFrame(draw)
    }

    scheduleFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelFrame()
    }
  }, [initStars, scheduleFrame, cancelFrame, visibleRef])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}