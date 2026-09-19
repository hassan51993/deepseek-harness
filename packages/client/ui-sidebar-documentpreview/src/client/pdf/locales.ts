/** Copy owned by the PDF renderer. */
export const ar = {
  title: 'PDF',
  pageImage: 'صفحة PDF رقم {page}',
  loading: 'جارٍ القراءة…',
  rendering: 'جارٍ عرض الصفحة…',
  failed: 'تعذّر عرض PDF: {message}',
  password: 'يتطلّب ملف PDF هذا كلمة مرور، ومعاينة الملفات المحمية بكلمة مرور غير مدعومة.',
  workerFailed: 'تعذّر إكمال عملية عرض PDF. أعد المحاولة.',
  unsupported: 'تتطلّب معاينة PDF محتوى الملف كاملًا.',
  retry: 'إعادة المحاولة',
} satisfies Record<string, string>

/** PDF translation keys shared by both dictionaries. */
export type PdfLocaleKey = keyof typeof ar

/** English PDF-renderer dictionary. */
export const en = {
  title: 'PDF',
  pageImage: 'PDF page {page}',
  loading: 'Reading…',
  rendering: 'Rendering page…',
  failed: 'Cannot display PDF: {message}',
  password: 'This PDF requires a password; password-protected previews are not supported.',
  workerFailed: 'The PDF rendering process could not continue. Please retry.',
  unsupported: 'PDF preview requires the complete file contents.',
  retry: 'Retry',
} satisfies Record<PdfLocaleKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** PDF page, loading, and failure messages. */
    sidebarPdf: PdfLocaleKey
  }
}
