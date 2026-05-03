import { useContext } from 'react'
import { I18nReactContext, type I18nValue } from '@/i18n/context'

export function useI18n(): I18nValue {
  const ctx = useContext(I18nReactContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
