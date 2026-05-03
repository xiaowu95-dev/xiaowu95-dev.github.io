import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nReactContext } from '@/i18n/context'
import {
  DEFAULT_LOCALE,
  type Locale,
  getMessage,
  persistLocale,
  readStoredLocale,
} from '@/i18n/messages'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? DEFAULT_LOCALE)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  const t = useCallback((path: string) => getMessage(locale, path), [locale])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = getMessage(locale, 'documentTitle')
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nReactContext.Provider value={value}>{children}</I18nReactContext.Provider>
}
