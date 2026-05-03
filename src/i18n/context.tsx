import { createContext } from 'react'
import type { Locale } from '@/i18n/messages'

export type TranslateFn = (path: string) => string

export type I18nValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: TranslateFn
}

export const I18nReactContext = createContext<I18nValue | null>(null)
