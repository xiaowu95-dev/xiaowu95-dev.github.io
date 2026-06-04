import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Pauses ALL GSAP animations when the browser tab is hidden,
 * and resumes when visible again. Uses document.visibilitychange.
 * Call once at the chapter level.
 */
export function useGsapVisibilityPause() {
  useEffect(() => {
    const onVisChange = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause()
      } else {
        gsap.globalTimeline.resume()
      }
    }
    document.addEventListener('visibilitychange', onVisChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisChange)
      gsap.globalTimeline.resume() // ensure resumed on unmount
    }
  }, [])
}