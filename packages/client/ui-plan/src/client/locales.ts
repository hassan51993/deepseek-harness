/** `plan` namespace dictionaries (the composer plan chip's copy). */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'chip.label': 'Plan',
  'preview.title': 'حساب تخطيط',
  'preview.document': 'حساب تخطيط · Markdown',
  'preview.action': 'فتح',
  'preview.open': 'في جانب حافة شريط فتح حساب تخطيط',
  'preview.full': 'فحص نظر كل نص',
  'preview.openNamed': 'فتح حساب تخطيط:{title}',
  'preview.loading': 'صحيح في قراءة حساب تخطيط…',
  'preview.failed': 'لا يمكن قراءة حساب تخطيط',
  'preview.invalidAddress': 'حساب تخطيط عنوان بلا فاعلية',
  'preview.historyUnavailable': 'لا يمكن قراءة جلسة تاريخ',
  'preview.notFound': 'لم بحث إلى هذا نسخة حساب تخطيط',
  'preview.unavailable': 'حساب تخطيط معاينة غير ممكن استخدام',
  'preview.expired': 'مؤقت حساب تخطيط معاينة قد بطلان، طلب من ما زال في انتظار مراجعة دفعة بطاقة إعادة فتح.',
  'chip.on.aria': 'plan mode قد فتح بدء، حسب تحت إغلاق',
  'chip.on.title': 'plan mode قد فتح بدء — نقر إغلاق (/plan off)',
  'chip.off.aria': 'plan mode قد إغلاق، حسب تحت فتح بدء',
  'chip.off.title': 'plan mode قد إغلاق — نقر فتح بدء (/plan)',
  'chip.exitFailed': 'خروج plan mode فشل',
} satisfies Record<string, string>

/** The plan namespace key union. */
export type PlanKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'chip.label': 'Plan',
  'preview.title': 'Plan',
  'preview.document': 'Plan · Markdown',
  'preview.action': 'Open',
  'preview.open': 'Open plan in sidebar',
  'preview.full': 'View full plan',
  'preview.openNamed': 'Open plan: {title}',
  'preview.loading': 'Loading plan…',
  'preview.failed': 'Could not load plan',
  'preview.invalidAddress': 'Invalid plan address',
  'preview.historyUnavailable': 'Session history is unavailable',
  'preview.notFound': 'This plan was not found',
  'preview.unavailable': 'Plan preview is unavailable',
  'preview.expired': 'This temporary plan preview has expired. Reopen it from the pending review card.',
  'chip.on.aria': 'Plan mode on, press to turn off',
  'chip.on.title': 'Plan mode on — click to turn off (/plan off)',
  'chip.off.aria': 'Plan mode off, press to turn on',
  'chip.off.title': 'Plan mode off — click to turn on (/plan)',
  'chip.exitFailed': 'Failed to exit plan mode',
} satisfies Record<PlanKey, string>
