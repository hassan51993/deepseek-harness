/**
 * `command` namespace dictionaries: the composer menu's section headings,
 * the client face (title, description, claim token) of the built-in Host
 * commands whose catalog descriptors carry English text only, and the
 * popupSelect shell's copy.
 */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'section.add': 'إضافة',
  'section.commands': 'إشارة أمر',
  'label.goal': 'هدف',
  'label.plan': 'خطة',
  'label.feedback': 'ملاحظات',
  'label.compact': 'ضغط',
  'label.permission': 'إذن',
  'label.export': 'تحت تحميل سجل',
  'description.goal': 'ضبط أو عرض طويل مدة مهمة هدف',
  'description.plan': 'دخول أو خروج خطة نمط',
  'description.feedback': 'إرسال صلة في حالي جلسة ملاحظات',
  'description.compact': 'ضغط بـ فوق محادثة محتوى',
  'description.permission': 'تبديل إذن مسبق ضبط (صندوق رملي نمط و مراجعة دفعة سياسة)',
  'description.export': 'سوف حالي جلسة محتوى تصدير لـ ZIP',
  'token.goal': 'هدف',
  'token.plan': 'خطة',
  'token.feedback': 'ملاحظات',
  'token.compact': 'ضغط',
  'token.permission': 'إذن',
  'token.export': 'تصدير',
  'search.placeholder': 'بحث…',
  'search.aria': 'غربلة اختيار خيار',
  'status.loading': 'جارٍ تحميل خيار…',
  'status.applying': 'جارٍ تطبيق…',
  'status.empty': 'بلا خيار',
  'overlay.aria': '/{command} خيار',
  'listbox.aria': '/{command} مطابقة بند',
  'notice.attachmentsUnsupported': '/{command} لا قبول مرفق عنصر، طلب أولا إزالة مرفق عنصر',
} satisfies Record<string, string>

/** The command namespace key union. */
export type CommandKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'section.add': 'Add',
  'section.commands': 'Commands',
  'label.goal': 'Goal',
  'label.plan': 'Plan',
  'label.feedback': 'Feedback',
  'label.compact': 'Compact',
  'label.permission': 'Permission',
  'label.export': 'Export',
  'description.goal': 'Set or view the goal for a long-running task',
  'description.plan': 'Enter or leave plan mode',
  'description.feedback': 'Record feedback about this session',
  'description.compact': 'Compact older conversation history',
  'description.permission': 'Switch the permission preset (sandbox mode + approval policy)',
  'description.export': 'Download this Session log as a ZIP archive',
  'token.goal': 'goal',
  'token.plan': 'plan',
  'token.feedback': 'feedback',
  'token.compact': 'compact',
  'token.permission': 'permission',
  'token.export': 'export',
  'search.placeholder': 'Search…',
  'search.aria': 'Filter options',
  'status.loading': 'Loading options…',
  'status.applying': 'Applying…',
  'status.empty': 'No options',
  'overlay.aria': '/{command} options',
  'listbox.aria': '/{command} matches',
  'notice.attachmentsUnsupported': '/{command} does not accept attachments; remove them first',
} satisfies Record<CommandKey, string>
