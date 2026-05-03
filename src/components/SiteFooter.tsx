export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.06] bg-surface-deep/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-gray-500">
          © {year} Studio Wu. Crafted for focused Japanese study.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-gold-500"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-gold-500"
          >
            X
          </a>
          <a href="mailto:hello@example.com" className="transition-colors hover:text-gold-500">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
