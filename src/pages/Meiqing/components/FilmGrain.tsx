import { useEffect, useRef } from 'react'

export default function FilmGrain() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onVisibilityChange = () => {
      el.classList.toggle('meqing-grain--paused', document.hidden)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return <div ref={ref} className="meqing-grain" aria-hidden="true" />
}
