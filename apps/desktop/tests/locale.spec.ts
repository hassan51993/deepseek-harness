import { describe, expect, it } from 'vitest'
import { en, formatDesktopMessage, resolveDesktopLocale, ar } from '../src/locale.ts'

describe('desktop locale dictionaries', () => {
  it('ships the same key set in English and Arabic', () => {
    expect(Object.keys(ar)).toEqual(Object.keys(en))
    expect(resolveDesktopLocale('ar-Arab-CN').messages).toEqual(ar)
    expect(resolveDesktopLocale('en-US').messages).toEqual(en)
    expect(resolveDesktopLocale('fr-FR').messages).toEqual(en)
  })

  it('formats named values without consuming unknown placeholders', () => {
    expect(formatDesktopMessage('{name}@{version} {missing}', { name: 'plugin', version: '1.2.3' }))
      .toBe('plugin@1.2.3 {missing}')
  })

})
