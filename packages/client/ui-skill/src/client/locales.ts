/** `skill` namespace dictionaries for the dedicated tool row. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'skill'

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'row.title': 'مهارة',
  'row.running': 'جارٍ تحميل المهارة',
  'row.failed': 'تعذّر تحميل المهارة',
  'row.stopped': 'توقّف تحميل المهارة',
  'row.instructions': 'التعليمات',
  'row.inspect': 'فحص',
  'menu.userOnly': 'للمستخدم فقط',
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
