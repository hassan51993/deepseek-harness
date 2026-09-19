import { en as commonEn } from '@deepseek-ai/dsh-client-locale/src/locales/en.ts'
import { ar as commonAr } from '@deepseek-ai/dsh-client-locale/src/locales/ar.ts'
import { en, ar, type TrajectoryTranslate } from '../src/client/locales.ts'

function translator(dictionary: Record<string, string>): TrajectoryTranslate {
  return (key, params = {}) => {
    const template = dictionary[key] ?? key
    return template.replace(/\{(\w+)\}/g, (_match, name: string) => {
      const value = params[name]
      return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? String(value)
        : ''
    })
  }
}

/** English trajectory translator for component and pure-layout tests. */
export const t = translator({ ...commonEn, ...en })

/** Arabic trajectory translator for real-view fixtures that open in Arabic. */
export const tAr = translator({ ...commonAr, ...ar })
