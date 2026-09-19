/** `approval` namespace dictionaries. */

/** Arabic dictionary and key-set source of truth. */
export const ar = {
  waiting: 'انتظار مراجعة دفعة',
  'detail.aria': 'مراجعة دفعة تفصيل حال',
  escalation: 'أداة {toolName} طلب تجاوز حق تنفيذ',
  reject: 'رفض',
  allowOnce: 'سماح مرة',
} satisfies Record<string, string>

/** Approval dictionary key union. */
export type ApprovalKey = keyof typeof ar

/** English dictionary, checked against the Arabic key set. */
export const en = {
  waiting: 'Waiting for approval',
  'detail.aria': 'Approval details',
  escalation: 'Tool {toolName} requests privileged execution',
  reject: 'Reject',
  allowOnce: 'Allow once',
} satisfies Record<ApprovalKey, string>
