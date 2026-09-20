/** Locale namespace owned by Session export browser feedback. */
export const NS = 'session-log-download'

/** Arabic Session export strings. */
export const ar = {
  'header.more': 'إجراءات أخرى',
  'menu.download': 'تنزيل سجل الجلسة',
  'dialog.preparingTitle': 'جارٍ تصدير الجلسة',
  'dialog.preparingDescription': 'جارٍ تحضير أرشيف ZIP يتضمّن هذه الجلسة وجلساتها الفرعية ومرفقاتها.',
  'dialog.successTitle': 'بدأ تنزيل الجلسة',
  'dialog.successDescription': 'المتصفح ينزّل أرشيف ZIP الخاص بالجلسة.',
  'dialog.errorTitle': 'فشل تصدير الجلسة',
  'dialog.close': 'إغلاق',
  'dialog.commandFailed': 'تعذّر بدء تصدير الجلسة.',
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
