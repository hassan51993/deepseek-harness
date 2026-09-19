/** `sidebar` namespace dictionaries for shell controls and global panels. */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'session.new': 'جديد جلسة',
  'session.new.label': 'جديد بناء جلسة',
  'toggle.open': 'فتح جانب حافة شريط',
  'toggle.collapse': 'استلام بدء جانب حافة شريط',
  'panels.label': 'عام وجه لوح',
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
