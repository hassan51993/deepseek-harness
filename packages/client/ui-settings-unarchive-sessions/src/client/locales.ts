/** Copy dictionaries for the archived-session Settings page. */

/** Arabic dictionary and key source of truth. */
export const ar = {
  nav: 'قد عودة ملف جلسة',
  search: 'بحث قد عودة ملف جلسة',
  loading: 'صحيح في قراءة جلسة…',
  empty: 'مؤقت بلا قد عودة ملف جلسة.',
  unavailable: 'هذا داخل لا يوجد يمكن استعادة قد عودة ملف جلسة.',
  emptySearch: 'لا يوجد مطابقة جلسة.',
  unarchive: 'إلغاء عودة ملف',
  unarchiveNamed: 'إلغاء عودة ملف {title}',
  ungrouped: 'لم قسم مجموعة',
  'time.now': 'للتو للتو',
  'time.minutes': '{n}قسم ساعة',
  'time.hours': '{n}صغير وقت',
  'time.days': '{n}يوم',
  'time.months': '{n}عدد شهر',
  'time.years': '{n}سنة',
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
