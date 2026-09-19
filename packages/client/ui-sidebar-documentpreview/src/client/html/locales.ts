/** Locale-owned HTML implementation name and iframe status text. */
export const ar = {
  title: 'HTML',
  frame: 'HTML وثيقة معاينة',
  loading: 'صحيح في قراءة…',
  failed: 'لا يمكن معاينة هذا نسخة HTML وثيقة',
} satisfies Record<string, string>

/** HTML renderer dictionary keys. */
export type HtmlPreviewKey = keyof typeof ar

/** English dictionary with the same keys as the Arabic dictionary. */
export const en = {
  title: 'HTML',
  frame: 'HTML document preview',
  loading: 'Reading…',
  failed: 'This HTML document could not be previewed.',
} satisfies Record<HtmlPreviewKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** HTML preview selection and status text. */
    documentHtml: HtmlPreviewKey
  }
}
