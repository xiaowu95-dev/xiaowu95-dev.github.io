import { Link, NavLink } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="border-b border-white/[0.06] bg-surface-deep/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-[color:oklch(0.94_0.02_85)] transition-colors group-hover:text-gold-500">
            Studio Wu
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-gray-500 sm:inline">
            Apps
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                'transition-colors hover:text-gold-400',
                isActive ? 'text-gold-500' : '',
              ].join(' ')
            }
            end
          >
            Work
          </NavLink>
          <a
            href="#about"
            className="transition-colors hover:text-gold-400"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            About
          </a>
        </nav>
      </div>
    </header>
  )
}
