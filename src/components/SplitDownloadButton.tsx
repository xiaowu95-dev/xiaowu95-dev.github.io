import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'

function formatVersionLine(t: (key: string) => string, key: string, version: string) {
  return t(key).replace(/\{\{v\}\}/g, version)
}

export function SplitDownloadButton({
  titleKey,
  versionKey,
  version,
  primaryUrl,
  altUrl,
  altLabelKey,
}: {
  titleKey: string
  versionKey: string
  version: string | null
  primaryUrl: string
  altUrl?: string
  altLabelKey?: string
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') close()
    },
    [close],
  )

  const hasAlt = Boolean(altUrl && altLabelKey)

  return (
    <div ref={ref} className="relative inline-flex items-stretch" onKeyDown={onKey}>
      {/* Primary download */}
      <a
        href={primaryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 flex-1 flex-col items-start justify-center gap-0.5 border border-gold-500/35 bg-[#0c0c0c] px-7 py-3.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:border-gold-400/60 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
          hasAlt ? 'rounded-l-full rounded-r-none border-r-0' : 'rounded-full'
        }`}
      >
        <span className="text-sm font-semibold text-[color:oklch(0.93_0.02_85)]">
          {t(titleKey)}
        </span>
        {version && (
          <span className="text-xs font-normal text-gray-500">
            {formatVersionLine(t, versionKey, version)}
          </span>
        )}
      </a>

      {hasAlt && (
        <>
          {/* Divider */}
          <div className="w-px bg-gold-500/35" />

          {/* Caret toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-r-full border border-gold-500/35 border-l-0 bg-[#0c0c0c] px-2 text-gold-500 transition duration-300 ease-out hover:border-gold-400/60 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 top-full z-10 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-gold-500/35 bg-[#0c0c0c] shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                role="menu"
              >
                <a
                  href={altUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2.5 text-sm text-gold-500/90 transition-colors hover:bg-white/5"
                  role="menuitem"
                  onClick={close}
                >
                  {altLabelKey && t(altLabelKey)}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
