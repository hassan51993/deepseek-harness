/**
 * `slash.menu` namespace dictionaries: group titles keyed by source name
 * (the lookup chain returns the key itself, so an unknown source shows its
 * raw name), the pending row, and the listbox and header aria labels.
 */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'command': 'إشارة أمر',
  'skill': 'تقنية قدرة',
  'subagent': 'فرعي ذكي جسم',
  'loading': 'صحيح في تحميل…',
  'drill.aria': 'دخول دليل',
  'drill.hint': 'دخول دليل',
  'drill.key': 'Tab',
  'crumbs.aria': 'دليل تنقل',
  'suggestions.aria': 'إطلاق مرشح بناء اقتراح',
} satisfies Record<string, string>

/** The slash.menu namespace key union. */
export type MenuKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'command': 'Commands',
  'skill': 'Skills',
  'subagent': 'Subagents',
  'loading': 'Loading…',
  'drill.aria': 'Browse folder',
  'drill.hint': 'Browse folder',
  'drill.key': 'Tab',
  'crumbs.aria': 'Folder navigation',
  'suggestions.aria': 'Trigger suggestions',
} satisfies Record<MenuKey, string>
