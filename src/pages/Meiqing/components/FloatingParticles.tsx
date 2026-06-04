import { useCallback, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  rotation: number
  rotationSpeed: number
}

interface FloatingParticlesProps {
  count?: number
  color?: string
  speed?: number
  className?: string
}

export default function FloatingParticles({
  count = 35,
  color = 'oklch(0.85 0.06 85)',
  speed = 0.3,
  className = '',
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  const spawnParticle = useCallback(
    (width: number, height: number, fromTop = true): Particle => ({
      x: Math.random() * width,
      y: fromTop ? -10 : Math.random() * height,
      vx: (Math.random() - 0.5) * speed * 0.5,
      vy: Math.random() * speed + speed * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.15,
      life: 0,
      maxLife: 300 + Math.random() * 200,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }),
    [speed],
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
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const rect = canvas.getBoundingClientRect()
    particlesRef.current = Array.from({ length: count }, () =>
      spawnParticle(rect.width, rect.height, false),
    )

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)

      particlesRef.current = particlesRef.current.map((p) => {
        let particle = { ...p }
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed
        particle.life++

        // Gentle sway
        particle.vx += Math.sin(particle.life * 0.01) * 0.003

        // Fade in/out
        const fadeIn = Math.min(particle.life / 30, 1)
        const fadeOut = Math.max(1 - (particle.life - particle.maxLife + 50) / 50, 0)
        const alpha = particle.opacity * fadeIn * (particle.life > particle.maxLife - 50 ? fadeOut : 1)

        if (particle.life > particle.maxLife || particle.y > height + 20) {
          particle = spawnParticle(width, height, true)
        }

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.beginPath()

        // Draw a soft circle (petal-like)
        ctx.ellipse(0, 0, particle.size, particle.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()

        // Glow
        ctx.globalAlpha = alpha * 0.3
        ctx.beginPath()
        ctx.ellipse(0, 0, particle.size * 2.5, particle.size * 1.5, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
        return particle
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [count, color, spawnParticle])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
