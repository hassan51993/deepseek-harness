/** `job` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'job'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'count.live.one': '{count} عدد خلفية مهمة تشغيل في',
  'count.live.other': '{count} عدد خلفية مهمة تشغيل في',
  'count.idle.one': '{count} عدد خلفية مهمة',
  'count.idle.other': '{count} عدد خلفية مهمة',
  'list.aria': 'خلفية مهمة',
  'status.running': 'تشغيل في',
  'status.stopping': 'صحيح في إيقاف',
  'status.completed': 'قد إتمام',
  'status.killed': 'قد إلغاء',
  'status.failed': 'قد فشل',
  'duration.seconds': '{seconds}ثانية',
  'duration.minutes': '{minutes}قسم{seconds}ثانية',
  'duration.hours': '{hours}صغير وقت{minutes}قسم',
  'duration.title.live': 'قد تشغيل {duration}',
  'duration.title.done': 'استهلاك وقت {duration}',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<JobKey, string> = {
  'count.live.one': '{count} background job running',
  'count.live.other': '{count} background jobs running',
  'count.idle.one': '{count} background job',
  'count.idle.other': '{count} background jobs',
  'list.aria': 'Background jobs',
  'status.running': 'running',
  'status.stopping': 'stopping',
  'status.completed': 'completed',
  'status.killed': 'cancelled',
  'status.failed': 'failed',
  'duration.seconds': '{seconds}s',
  'duration.minutes': '{minutes}m {seconds}s',
  'duration.hours': '{hours}h {minutes}m',
  'duration.title.live': 'Running for {duration}',
  'duration.title.done': 'Took {duration}',
}

/** Key domain of the `job` namespace (zh is the source of truth). */
export type JobKey = keyof typeof zh
