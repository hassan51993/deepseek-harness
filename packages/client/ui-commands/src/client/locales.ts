/**
 * `command` namespace dictionaries: the composer menu's section headings,
 * the client face (title, description, claim token) of the built-in Host
 * commands whose catalog descriptors carry English text only, and the
 * popupSelect shell's copy.
 */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'section.add': 'إضافة',
  'section.commands': 'الأوامر',
  'label.goal': 'هدف',
  'label.plan': 'خطة',
  'label.feedback': 'ملاحظات',
  'label.compact': 'ضغط',
  'label.permission': 'أذونات',
  'label.export': 'تصدير',
  'description.goal': 'تحديد هدف مهمة طويلة أو عرضه',
  'description.plan': 'الدخول إلى وضع التخطيط أو الخروج منه',
  'description.feedback': 'تسجيل ملاحظات عن هذه الجلسة',
  'description.compact': 'ضغط الأجزاء الأقدم من المحادثة',
  'description.permission': 'تبديل الإعداد المسبق للأذونات (وضع العزل وسياسة الموافقة)',
  'description.export': 'تنزيل سجل هذه الجلسة كأرشيف ZIP',
  'token.goal': 'هدف',
  'token.plan': 'خطة',
  'token.feedback': 'ملاحظات',
  'token.compact': 'ضغط',
  'token.permission': 'أذونات',
  'token.export': 'تصدير',
  'search.placeholder': 'بحث…',
  'search.aria': 'تصفية الخيارات',
  'status.loading': 'جارٍ تحميل الخيارات…',
  'status.applying': 'جارٍ التطبيق…',
  'status.empty': 'لا توجد خيارات',
  'overlay.aria': 'خيارات /{command}',
  'listbox.aria': 'نتائج /{command}',
  'notice.attachmentsUnsupported': 'الأمر /{command} لا يقبل المرفقات؛ أزِلها أولًا',
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
