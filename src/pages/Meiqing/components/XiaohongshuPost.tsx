import { motion } from 'framer-motion'

interface XiaohongshuPostProps {
  visible: boolean
}

/**
 * Simulates a Xiaohongshu (Little Red Book) post card.
 * Minimal, everyday content — not dramatic, just real.
 */
export default function XiaohongshuPost({ visible }: XiaohongshuPostProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      }}
      className="mx-auto max-w-[320px] md:max-w-[360px]"
    >
      {/* Phone frame */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'oklch(0.12 0.015 270)',
          border: '1px solid oklch(0.25 0.03 270 / 0.35)',
          boxShadow: '0 20px 60px oklch(0.04 0.01 270 / 0.5), 0 4px 16px oklch(0.04 0.01 270 / 0.3)',
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-5 pt-3 pb-1"
          style={{ background: 'oklch(0.10 0.015 270)' }}
        >
          <span className="text-xs" style={{ color: 'oklch(0.7 0.03 270)' }}>22:17</span>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.7 0.03 270)">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.7 0.03 270)">
              <rect x="2" y="6" width="18" height="12" rx="2" stroke="oklch(0.7 0.03 270)" strokeWidth="1.5" fill="none" />
              <rect x="21" y="10" width="2" height="4" rx="0.5" fill="oklch(0.7 0.03 270)" />
              <rect x="4" y="8" width="10" height="8" rx="1" fill="oklch(0.35 0.05 130)" />
            </svg>
          </div>
        </div>

        {/* Post content */}
        <div className="px-4 pt-3 pb-4">
          {/* Image placeholder */}
          <div
            className="w-full aspect-[4/3] rounded-lg mb-3 overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, oklch(0.20 0.05 300) 0%, oklch(0.25 0.06 50) 50%, oklch(0.18 0.04 280) 100%)',
            }}
          >
            {/* Decorative content to simulate a post image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.6 0.04 280)"
                  strokeWidth="1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
            </div>
            {/* Film vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px oklch(0.06 0.01 270 / 0.3)' }}
            />
          </div>

          {/* Post title */}
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: 'oklch(0.92 0.015 80)' }}
          >
            蹲个搭子
          </p>

          {/* Post text */}
          <p
            className="text-sm leading-relaxed mb-2"
            style={{ color: 'oklch(0.82 0.012 80)' }}
          >
            生活圈子单一，家单位健身房，兴趣爱好比较杂......喜欢小动物，宅又不宅，不太喜欢社交...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['#蹲个搭子', '#日常', '#找朋友'].map((tag) => (
              <span
                key={tag}
                className="text-xs"
                style={{ color: 'oklch(0.55 0.10 20)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2.5 pt-2.5" style={{ borderTop: '1px solid oklch(0.2 0.02 270 / 0.5)' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{
                background: 'linear-gradient(135deg, oklch(0.55 0.08 20) 0%, oklch(0.45 0.06 340) 100%)',
                color: 'oklch(0.92 0.015 80)',
                fontFamily: 'var(--font-en, serif)',
              }}
            >
              蓝
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'oklch(0.82 0.015 80)' }}>是蓝蓝</p>
              <p className="text-xs opacity-30" style={{ color: 'oklch(0.6 0.02 270)' }}>3天前</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs opacity-30" style={{ color: 'oklch(0.6 0.02 270)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline mr-0.5 -mt-0.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                12
              </span>
              <span className="text-xs opacity-30" style={{ color: 'oklch(0.6 0.02 270)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline mr-0.5 -mt-0.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
