/** Locale namespace owned by Session export browser feedback. */
export const NS = 'session-log-download'

/** Arabic Session export strings. */
export const ar = {
  'header.more': 'أكثر كثير عملية',
  'menu.download': 'تحت تحميل Session سجل',
  'dialog.preparingTitle': 'جارٍ تصدير Session',
  'dialog.preparingDescription': 'جارٍ دقيق تجهيز يتضمن حالي Session، فرعي Session و مرفق عنصر ZIP ملف.',
  'dialog.successTitle': 'Session تصدير قد بدء تحت تحميل',
  'dialog.successDescription': 'متصفح جارٍ تحت تحميل Session ZIP ملف.',
  'dialog.errorTitle': 'Session تصدير فشل',
  'dialog.close': 'إغلاق',
  'dialog.commandFailed': 'لا يمكن بدء Session تصدير.',
} as const

/** English Session export strings. */
export const en: Record<keyof typeof ar, string> = {
  'header.more': 'More actions',
  'menu.download': 'Download session log',
  'dialog.preparingTitle': 'Exporting Session',
  'dialog.preparingDescription': 'Preparing a ZIP containing this Session, its sub-Sessions, and attachments.',
  'dialog.successTitle': 'Session download started',
  'dialog.successDescription': 'The browser is downloading the Session ZIP.',
  'dialog.errorTitle': 'Session export failed',
  'dialog.close': 'Close',
  'dialog.commandFailed': 'Could not start the Session export.',
}

/** Stable locale keys consumed by the shared modal. */
export type SessionLogDownloadKey = keyof typeof ar
