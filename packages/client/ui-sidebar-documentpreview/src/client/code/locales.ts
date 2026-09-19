/** Locale-owned code renderer name and CodeBlock controls. */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Code document implementation name and copy controls. */
    sidebarCodePreview: keyof typeof ar
  }
}

/** Arabic dictionary and key source. */
export const ar = {
  title: 'الشيفرة',
  copy: 'نسخ',
  copied: 'تم النسخ',
}

/** English dictionary with the same keys. */
export const en = {
  title: 'Code',
  copy: 'Copy',
  copied: 'Copied',
} satisfies Record<keyof typeof ar, string>
