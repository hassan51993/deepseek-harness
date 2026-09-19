/** Locale namespace owned by Session export browser feedback. */
export const NS = 'session-log-download'

/** Simplified-Chinese Session export strings. */
export const zh = {
  'header.more': 'أكثر كثير عملية',
  'menu.download': 'تحت تحميل Session سجل',
  'dialog.preparingTitle': 'صحيح في توجيه خروج Session',
  'dialog.preparingDescription': 'صحيح في دقيق تجهيز يتضمن حالي Session، فرعي Session و مرفق عنصر ZIP ملف.',
  'dialog.successTitle': 'Session توجيه خروج قد بدء تحت تحميل',
  'dialog.successDescription': 'متصفح صحيح في تحت تحميل Session ZIP ملف.',
  'dialog.errorTitle': 'Session توجيه خروج فشل',
  'dialog.close': 'إغلاق',
  'dialog.commandFailed': 'لا يمكن بدء Session توجيه خروج.',
} as const

/** English Session export strings. */
export const en: Record<keyof typeof zh, string> = {
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
export type SessionLogDownloadKey = keyof typeof zh
