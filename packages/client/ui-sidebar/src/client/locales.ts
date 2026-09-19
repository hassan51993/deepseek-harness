/** `sidebar` namespace dictionaries for shell controls and global panels. */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'session.new': 'جلسة جديدة',
  'session.new.label': 'جلسة جديدة',
  'toggle.open': 'فتح الشريط الجانبي',
  'toggle.collapse': 'طي الشريط الجانبي',
  'panels.label': 'اللوحات العامة',
} satisfies Record<string, string>

/** The sidebar namespace key union. */
export type SidebarKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'session.new': 'New Session',
  'session.new.label': 'New session',
  'toggle.open': 'Open sidebar',
  'toggle.collapse': 'Collapse sidebar',
  'panels.label': 'Global panels',
} satisfies Record<SidebarKey, string>
