/** `schedule.catalog` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'schedule.catalog'

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'trigger.one': '{count} عدد رفع تنبيه',
  'trigger.other': '{count} عدد رفع تنبيه',
  'list.aria': 'نشط حركة رفع تنبيه',
  'status.scheduled': 'انتظار في',
  'status.overdue': 'قد تجاوز مدة',
  'frequency.once': 'مفرد مرة',
  'frequency.every': '{value}{unit}مرة',
  'unit.day.one': 'يوم',
  'unit.day.other': 'يوم',
  'unit.hour.one': 'صغير وقت',
  'unit.hour.other': 'صغير وقت',
  'unit.minute.one': 'قسم ساعة',
  'unit.minute.other': 'قسم ساعة',
  'unit.second.one': 'ثانية',
  'unit.second.other': 'ثانية',
  'relative.now': 'الآن إلى مدة',
  'relative.future': '{value}{unit}بعد',
  'relative.overdue': 'قد تجاوز مدة {value}{unit}',
} as const

/** English dictionary, key-identical to the Arabic source of truth. */
export const en: Record<ScheduleCatalogKey, string> = {
  'trigger.one': '{count} reminder',
  'trigger.other': '{count} reminders',
  'list.aria': 'Active reminders',
  'status.scheduled': 'Scheduled',
  'status.overdue': 'Overdue',
  'frequency.once': 'Once',
  'frequency.every': 'Every {value} {unit}',
  'unit.day.one': 'day',
  'unit.day.other': 'days',
  'unit.hour.one': 'hour',
  'unit.hour.other': 'hours',
  'unit.minute.one': 'minute',
  'unit.minute.other': 'minutes',
  'unit.second.one': 'second',
  'unit.second.other': 'seconds',
  'relative.now': 'Due now',
  'relative.future': 'in {value} {unit}',
  'relative.overdue': '{value} {unit} overdue',
}

/** Key domain of the Schedule catalog namespace. */
export type ScheduleCatalogKey = keyof typeof ar
