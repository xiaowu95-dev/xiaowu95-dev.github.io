import { useI18n } from '@/i18n/useI18n'

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-white/[0.06] bg-surface-deep/80">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <p className="text-sm text-gray-500">{t('footer.copyrightLine')}</p>
      </div>
    </footer>
  )
}
