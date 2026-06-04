import { useCallback, useEffect, useRef } from 'react'
import { useCanvasVisibility } from './useCanvasVisibility'

interface FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  hue: number
  trail: { x: number; y: number }[]
}

interface Firework {
  x: number
  y: number
  targetY: number
  vy: number
  exploded: boolean
  particles: FireworkParticle[]
  hue: number
}

interface FireworksProps {
  active?: boolean
  className?: string
}

const GRAVITY = 0.04
const PARTICLE_COUNT = 60

function createExplosion(x: number, y: number, hue: number): FireworkParticle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 3 + 1
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2 + 0.5,
      opacity: 1,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      hue: hue + Math.random() * 30 - 15,
      trail: [],
    }
  })
}

export default function Fireworks({ active = false, className = '' }: FireworksProps) {
  const { canvasRef, visibleRef, scheduleFrame, cancelFrame } = useCanvasVisibility()
  const fireworksRef = useRef<Firework[]>([])
  const frameRef = useRef(0)

  const spawnFirework = useCallback((width: number, height: number) => {
    const x = Math.random() * width * 0.6 + width * 0.2
    return {
      x,
      y: height,
      targetY: height * (0.15 + Math.random() * 0.3),
      vy: -(Math.random() * 3 + 4),
      exploded: false,
      particles: [],
      hue: Math.random() * 60 + 20, // warm golds and oranges
    }
  }, [])

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
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!visibleRef.current) {
        scheduleFrame(draw)
        return
      }

      if (!active) {
        return
      }

      const { width, height } = canvas.getBoundingClientRect()

      // Fade previous frame
      ctx.fillStyle = 'oklch(0.06 0.012 270 / 0.15)'
      ctx.fillRect(0, 0, width, height)

      frameRef.current++

      // Spawn new fireworks periodically
      if (frameRef.current % 80 === 0 || (frameRef.current < 10 && frameRef.current % 20 === 0)) {
        fireworksRef.current.push(spawnFirework(width, height))
      }

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (!fw.exploded) {
          // Rising phase
          fw.y += fw.vy
          fw.vy += GRAVITY * 0.5

          // Draw rising trail
          ctx.beginPath()
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `oklch(0.85 0.08 ${fw.hue})`
          ctx.globalAlpha = 0.9
          ctx.fill()
          ctx.globalAlpha = 1

          if (fw.y <= fw.targetY) {
            fw.exploded = true
            fw.particles = createExplosion(fw.x, fw.y, fw.hue)
          }
          return true
        }

        // Explosion phase
        fw.particles = fw.particles.filter((p) => {
          p.life++
          if (p.life > p.maxLife) return false

          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 5) p.trail.shift()

          p.x += p.vx
          p.y += p.vy
          p.vy += GRAVITY
          p.vx *= 0.985
          p.vy *= 0.985

          const progress = p.life / p.maxLife
          const alpha = 1 - progress

          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath()
            ctx.moveTo(p.trail[0].x, p.trail[0].y)
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y)
            }
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `oklch(0.85 0.12 ${p.hue} / ${alpha * 0.3})`
            ctx.lineWidth = p.size * 0.5
            ctx.stroke()
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = `oklch(0.88 0.1 ${p.hue})`
          ctx.globalAlpha = alpha
          ctx.fill()

          // Glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `oklch(0.8 0.1 ${p.hue})`
          ctx.globalAlpha = alpha * 0.15
          ctx.fill()
          ctx.globalAlpha = 1

          return true
        })

        return fw.particles.length > 0
      })

      scheduleFrame(draw)
    }

    scheduleFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelFrame()
    }
  }, [active, spawnFirework, canvasRef, visibleRef, scheduleFrame, cancelFrame])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
