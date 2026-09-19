/** Copy dictionaries for the archived-session Settings page. */

/** Arabic dictionary and key source of truth. */
export const ar = {
  nav: 'الجلسات المؤرشفة',
  search: 'بحث في الجلسات المؤرشفة',
  loading: 'جارٍ قراءة الجلسات…',
  empty: 'لا توجد جلسات مؤرشفة.',
  unavailable: 'لا توجد هنا جلسة مؤرشفة يمكن استعادتها.',
  emptySearch: 'لا توجد جلسات مطابقة.',
  unarchive: 'إلغاء الأرشفة',
  unarchiveNamed: 'إلغاء أرشفة {title}',
  ungrouped: 'بلا مجموعة',
  'time.now': 'الآن',
  'time.minutes': '{n} دقيقة',
  'time.hours': '{n} ساعة',
  'time.days': '{n} يوم',
  'time.months': '{n} شهر',
  'time.years': '{n} سنة',
} satisfies Record<string, string>

/** Archived-session page locale key union. */
export type ArchivedSessionsLocaleKey = keyof typeof ar

/** English dictionary checked against the Arabic key set. */
export const en = {
  nav: 'Archived sessions',
  search: 'Search archived sessions',
  loading: 'Reading sessions…',
  empty: 'No archived sessions.',
  unavailable: 'No archived session here can be restored.',
  emptySearch: 'No matching sessions.',
  unarchive: 'Unarchive',
  unarchiveNamed: 'Unarchive {title}',
  ungrouped: 'Ungrouped',
  'time.now': 'now',
  'time.minutes': '{n}min',
  'time.hours': '{n}h',
  'time.days': '{n}d',
  'time.months': '{n}mo',
  'time.years': '{n}y',
} satisfies Record<ArchivedSessionsLocaleKey, string>
