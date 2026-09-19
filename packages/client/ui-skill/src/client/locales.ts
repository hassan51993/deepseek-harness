/** `skill` namespace dictionaries for the dedicated tool row. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'skill'

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'row.title': 'Skill',
  'row.running': 'جارٍ تحميل skill',
  'row.failed': 'skill تحميل فشل',
  'row.stopped': 'skill تحميل قد في توقف',
  'row.instructions': 'شرح',
  'row.inspect': 'عرض',
  'menu.userOnly': 'فقط مستخدم',
} satisfies Record<string, string>

/** The skill namespace key union. */
export type SkillKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'row.title': 'Skill',
  'row.running': 'Loading skill',
  'row.failed': 'Skill load failed',
  'row.stopped': 'Skill load stopped',
  'row.instructions': 'Instructions',
  'row.inspect': 'Inspect',
  'menu.userOnly': 'user-only',
} satisfies Record<SkillKey, string>
