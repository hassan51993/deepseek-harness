/** Copy owned by the PDF renderer. */
export const zh = {
  title: 'PDF',
  pageImage: 'PDF رقم {page} صفحة',
  loading: 'صحيح في قراءة…',
  rendering: 'صحيح في رسم صنع صفحة…',
  failed: 'لا يمكن عرض PDF:{message}',
  password: 'هذا PDF حاجة سري رمز، مؤقت لا دعم حمل معاينة',
  workerFailed: 'PDF تصيير عملية لا يمكن متابعة، طلب إعادة محاولة',
  unsupported: 'PDF معاينة حاجة كامل ملف محتوى',
  retry: 'إعادة محاولة',
} satisfies Record<string, string>

/** PDF translation keys shared by both dictionaries. */
export type PdfLocaleKey = keyof typeof zh

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
