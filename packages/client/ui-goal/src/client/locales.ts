/** `goal` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'phase.active': 'إجراء في هدف',
  'phase.active.disarmed': 'لم تشغيل هدف',
  'phase.paused': 'قد مؤقت توقف هدف',
  'phase.blocked': 'تلقي منع هدف',
  'objective.aria': 'هدف محتوى',
  'commandInput.aria': 'إشارة أمر إدخال',
  'action.save': 'حفظ هدف',
  'action.cancel': 'إلغاء تحرير',
  'action.pause': 'مؤقت توقف هدف',
  'action.resume': 'استعادة هدف',
  'action.edit': 'تحرير هدف',
  'action.clear': 'صاف حذف هدف',
} satisfies Record<string, string>

/** The goal namespace key union. */
export type GoalKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
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
