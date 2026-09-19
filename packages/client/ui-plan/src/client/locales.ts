/** `plan` namespace dictionaries (the composer plan chip's copy). */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'chip.label': 'خطة',
  'preview.title': 'الخطة',
  'preview.document': 'الخطة · Markdown',
  'preview.action': 'فتح',
  'preview.open': 'فتح الخطة في الشريط الجانبي',
  'preview.full': 'عرض الخطة كاملة',
  'preview.openNamed': 'فتح الخطة: {title}',
  'preview.loading': 'جارٍ تحميل الخطة…',
  'preview.failed': 'تعذّر تحميل الخطة',
  'preview.invalidAddress': 'عنوان الخطة غير صالح',
  'preview.historyUnavailable': 'سجل الجلسة غير متاح',
  'preview.notFound': 'لم يُعثر على هذه الخطة',
  'preview.unavailable': 'معاينة الخطة غير متاحة',
  'preview.expired': 'انتهت صلاحية هذه المعاينة المؤقتة للخطة. أعد فتحها من بطاقة المراجعة المعلّقة.',
  'chip.on.aria': 'وضع التخطيط مفعّل، اضغط لإيقافه',
  'chip.on.title': 'وضع التخطيط مفعّل — انقر لإيقافه (/plan off)',
  'chip.off.aria': 'وضع التخطيط متوقف، اضغط لتفعيله',
  'chip.off.title': 'وضع التخطيط متوقف — انقر لتفعيله (/plan)',
  'chip.exitFailed': 'تعذّر الخروج من وضع التخطيط',
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
