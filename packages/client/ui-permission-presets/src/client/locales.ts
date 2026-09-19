/** `settings.permission` namespace dictionaries (the Permission row's copy). */

/** Locale namespace shared by both current-session permission pickers. */
export const PERMISSION_ACCESS_NS = 'permission.access'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'title': 'إذن',
  'description': 'اختيار جديد جلسة افتراضي إذن نمط',
  'loading': 'تحميل في',
  'unavailable': 'غير ممكن استخدام',
  'preset.readOnly': 'فقط يمكن فحص نظر',
  'preset.workspaceWrite': 'مساحة العمل داخل تعديل',
  'preset.fullAccess': 'تماما إذن',
  'confirm.title': 'تأكيد تفعيل تماما إذن؟',
  'confirm.description': 'تفعيل تماما إذن بعد، جديد جلسة سوف نقص قليل تأكيد خطوة، و كما يمكن مباشر تنفيذ أكثر كثير عملية، يشمل حساس شعور عملية، ملف تعديل أو خارجي أمر. فقط بناء اقتراح في أنت معلومة مهمة لاحق مهمة وقت استخدام.',
  'confirm.acknowledge': 'أنا قد حل ريح خطر، و رغبة معنى متابعة',
  'confirm.cancel': 'إلغاء',
  'confirm.enable': 'تفعيل تماما إذن',
} satisfies Record<string, string>

/** The settings.permission namespace key union. */
export type PermissionSettingsKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'title': 'Permission',
  'description': 'Choose the default permission mode for new sessions',
  'loading': 'Loading',
  'unavailable': 'Unavailable',
  'preset.readOnly': 'Read Only',
  'preset.workspaceWrite': 'Workspace Write',
  'preset.fullAccess': 'Full access',
  'confirm.title': 'Enable Full access?',
  'confirm.description': 'Full access lets new sessions reduce confirmation steps and perform more actions directly, including sensitive operations, file changes, or external commands. Only use it when you trust subsequent tasks.',
  'confirm.acknowledge': 'I understand the risks and want to continue',
  'confirm.cancel': 'Cancel',
  'confirm.enable': 'Enable Full access',
} satisfies Record<PermissionSettingsKey, string>

/** Simplified Chinese dictionary for the current-session popup gate. */
export const accessZh = {
  'mode': 'وصول نمط، حالي:{name}',
  'close': 'إغلاق',
  'preset.readOnly': 'فقط يمكن فحص نظر',
  'preset.workspaceWrite': 'مساحة العمل داخل تعديل',
  'preset.fullAccess': 'تماما إذن',
  'confirm.title': 'تأكيد تفعيل تماما إذن؟',
  'confirm.description': 'تفعيل تماما إذن بعد، ذكي جسم سوف نقص قليل تأكيد خطوة، و كما يمكن مباشر تنفيذ أكثر كثير عملية، يشمل حساس شعور عملية، ملف تعديل أو خارجي أمر. فقط بناء اقتراح في أنت معلومة مهمة حالي مهمة وقت استخدام.',
  'confirm.acknowledge': 'أنا قد حل ريح خطر، و رغبة معنى متابعة',
  'confirm.cancel': 'إلغاء',
  'confirm.enable': 'تفعيل تماما إذن',
  'auto.label': 'Auto review',
  'auto.badge': 'EXP',
  'auto.description': 'بلا صندوق رملي تشغيل؛ كل مرة أصلي أداة استدعاء و PTC داخل طبقة استدعاء قبل من نفس نموذج إجراء فعلي تحقق صفة مراجعة فحص.',
  'auto.confirm.title': 'تأكيد تفعيل Auto review(فعلي تحقق) ؟',
  'auto.confirm.description': 'Auto review لا استخدام صندوق رملي. كل مرة أصلي أداة استدعاء و PTC داخل طبقة استدعاء قبل، كل سوف من و حالي agent نفسه نموذج إجراء مراجعة فحص. هذا وظيفة ما زال تابع فعلي تحقق صفة، ممكن خطأ وضع سطر أو خطأ رفض، و سوف إزالة استهلاك مقدار خارج token.',
  'auto.confirm.acknowledge': 'أنا قد حل هذه ريح خطر، و رغبة معنى متابعة',
  'auto.confirm.enable': 'تفعيل Auto review',
} satisfies Record<string, string>

/** Current-session popup-gate key union. */
export type PermissionAccessKey = keyof typeof accessZh

/** English dictionary for the current-session popup gate. */
export const accessEn = {
  'mode': 'Access mode, current: {name}',
  'close': 'Close',
  'preset.readOnly': 'Read Only',
  'preset.workspaceWrite': 'Workspace Write',
  'preset.fullAccess': 'Full access',
  'confirm.title': 'Enable Full access?',
  'confirm.description': 'Full access reduces confirmation steps and lets the agent perform more actions directly, including sensitive operations, file changes, or external commands. Only use it when you trust the current task.',
  'confirm.acknowledge': 'I understand the risks and want to continue',
  'confirm.cancel': 'Cancel',
  'confirm.enable': 'Enable Full access',
  'auto.label': 'Auto review',
  'auto.badge': 'EXP',
  'auto.description': 'Run without a sandbox after an experimental same-model review of every native tool call and PTC inner call.',
  'auto.confirm.title': 'Enable Auto review (experimental)?',
  'auto.confirm.description': 'Auto review runs without a sandbox. Before every native tool call and PTC inner call, the same model as the current agent reviews whether to allow it. This feature is experimental, can falsely allow or deny actions, and uses additional tokens.',
  'auto.confirm.acknowledge': 'I understand these risks and want to continue',
  'auto.confirm.enable': 'Enable Auto review',
} satisfies Record<PermissionAccessKey, string>
