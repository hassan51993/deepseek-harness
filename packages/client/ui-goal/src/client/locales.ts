/** `goal` namespace dictionaries. */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'phase.active': 'هدف جارٍ',
  'phase.active.disarmed': 'هدف غير مفعّل',
  'phase.paused': 'هدف موقوف مؤقتًا',
  'phase.blocked': 'هدف متعثّر',
  'objective.aria': 'نص الهدف',
  'commandInput.aria': 'إدخال الأوامر',
  'action.save': 'حفظ الهدف',
  'action.cancel': 'إلغاء التحرير',
  'action.pause': 'إيقاف الهدف مؤقتًا',
  'action.resume': 'استئناف الهدف',
  'action.edit': 'تحرير الهدف',
  'action.clear': 'مسح الهدف',
} satisfies Record<string, string>

/** The goal namespace key union. */
export type GoalKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'phase.active': 'Ongoing Goal',
  'phase.active.disarmed': 'Inactive Goal',
  'phase.paused': 'Paused Goal',
  'phase.blocked': 'Blocked Goal',
  'objective.aria': 'Goal objective',
  'commandInput.aria': 'Command input',
  'action.save': 'Save goal',
  'action.cancel': 'Cancel edit',
  'action.pause': 'Pause goal',
  'action.resume': 'Resume goal',
  'action.edit': 'Edit goal',
  'action.clear': 'Clear goal',
} satisfies Record<GoalKey, string>
