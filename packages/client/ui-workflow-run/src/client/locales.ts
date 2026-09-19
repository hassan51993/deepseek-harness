/** `workflowRun` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'workflowRun'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'run.title': '{name}',
  'run.members.one': '{count} عدد عضو',
  'run.members.other': '{count} عدد عضو',
  'run.empty': 'لا يوجد بدء عضو',
  'phase.unassigned': 'لم قسم مرحلة مقطع',
  'phase.empty': 'فارغ مرحلة مقطع اسم',
  'statusCount.running': 'تشغيل في {count}',
  'statusCount.completed': 'قد إتمام {count}',
  'statusCount.failed': 'فشل {count}',
  'statusCount.cancelled': 'قد إلغاء {count}',
  'statusCount.interrupted': 'قد في قطع {count}',
  'member.empty': 'فارغ عضو اسم',
  'member.open': 'فتح {name}',
  'status.running': 'تشغيل في',
  'status.completed': 'قد إتمام',
  'status.failed': 'فشل',
  'status.cancelled': 'قد إلغاء',
  'status.interrupted': 'قد في قطع',
}

/** English dictionary (same key set). */
export const en: Record<WorkflowRunKey, string> = {
  'run.title': '{name}',
  'run.members.one': '{count} member',
  'run.members.other': '{count} members',
  'run.empty': 'No members started',
  'phase.unassigned': 'Unphased',
  'phase.empty': 'Empty phase name',
  'statusCount.running': 'Running {count}',
  'statusCount.completed': 'Completed {count}',
  'statusCount.failed': 'Failed {count}',
  'statusCount.cancelled': 'Cancelled {count}',
  'statusCount.interrupted': 'Interrupted {count}',
  'member.empty': 'Empty member name',
  'member.open': 'Open {name}',
  'status.running': 'Running',
  'status.completed': 'Completed',
  'status.failed': 'Failed',
  'status.cancelled': 'Cancelled',
  'status.interrupted': 'Interrupted',
}

/** Union of this namespace's dictionary keys. */
export type WorkflowRunKey = keyof typeof zh
