/** `approval` namespace dictionaries. */

/** Arabic dictionary and key-set source of truth. */
export const ar = {
  waiting: 'في انتظار الموافقة',
  'detail.aria': 'تفاصيل الموافقة',
  escalation: 'الأداة {toolName} تطلب تنفيذًا بصلاحيات مرتفعة',
  reject: 'رفض',
  allowOnce: 'السماح مرة واحدة',
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
