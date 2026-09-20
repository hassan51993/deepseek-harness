/** `workflowRun` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'workflowRun'

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'run.title': '{name}',
  'run.members.one': '{count} عضو',
  'run.members.other': '{count} أعضاء',
  'run.empty': 'لم يبدأ أي عضو',
  'phase.unassigned': 'بلا مرحلة',
  'phase.empty': 'اسم مرحلة فارغ',
  'statusCount.running': 'قيد التشغيل {count}',
  'statusCount.completed': 'مكتمل {count}',
  'statusCount.failed': 'فاشل {count}',
  'statusCount.cancelled': 'ملغى {count}',
  'statusCount.interrupted': 'مقطوع {count}',
  'member.empty': 'اسم عضو فارغ',
  'member.open': 'فتح {name}',
  'status.running': 'قيد التشغيل',
  'status.completed': 'مكتمل',
  'status.failed': 'فشل',
  'status.cancelled': 'ملغى',
  'status.interrupted': 'مقطوع',
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
export type WorkflowRunKey = keyof typeof ar
