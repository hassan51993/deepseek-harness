/** `job` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'job'

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'count.live.one': '{count} مهمة خلفية قيد التشغيل',
  'count.live.other': '{count} مهام خلفية قيد التشغيل',
  'count.idle.one': '{count} مهمة خلفية',
  'count.idle.other': '{count} مهام خلفية',
  'list.aria': 'مهام الخلفية',
  'status.running': 'قيد التشغيل',
  'status.stopping': 'جارٍ الإيقاف',
  'status.completed': 'مكتملة',
  'status.killed': 'ملغاة',
  'status.failed': 'فاشلة',
  'duration.seconds': '{seconds} ث',
  'duration.minutes': '{minutes} د {seconds} ث',
  'duration.hours': '{hours} س {minutes} د',
  'duration.title.live': 'يعمل منذ {duration}',
  'duration.title.done': 'استغرق {duration}',
} as const

/** English dictionary, key-identical to the Arabic source of truth. */
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

/** Key domain of the `job` namespace (ar is the source of truth). */
export type JobKey = keyof typeof ar
