/** Locale bundles for the agent-preset hero chip, header label, and management section. */

/** Locale keys these surfaces render. */
export type AgentPresetSettingsKey =
  | 'error' | 'userTrust' | 'seatHint' | 'headerHint'
  | 'nav' | 'sectionIntro' | 'builtIn' | 'setDefault' | 'view'
  | 'presetStandardName' | 'presetStandardDescription'
  | 'presetPtcName' | 'presetPtcDescription'
  | 'presetMinimalName' | 'presetMinimalDescription'
  | 'presetCordisName' | 'presetCordisDescription'
  | 'duplicate' | 'duplicateUnavailable' | 'delete' | 'presetId' | 'presetIdPlaceholder' | 'copyOf'
  | 'displayName' | 'displayNamePlaceholder'
  | 'inUse' | 'selectionOffDefault' | 'noDescription' | 'builtInGroup' | 'customGroup'
  | 'brokenBadge' | 'brokenNoCopy' | 'switchRefused'
  | 'composition' | 'cancel' | 'close' | 'retry'
  | 'copyTitle' | 'copyIntro' | 'create' | 'creating' | 'creatorDraft'
  | 'openLocation' | 'showLocation' | 'revealedPathLabel'
  | 'idRequired' | 'idInvalid' | 'idTaken'
  | 'deleteTitle' | 'deleteDescription' | 'deleteConfirm' | 'deleting'
  | 'showPicker' | 'showPickerBeta' | 'showPickerDescription'
  | 'enablePickerToSetDefault' | 'enablePickerToCreate'

/** English copy. */
export const en: Record<AgentPresetSettingsKey, string> = {
  error: 'Could not load agent presets.',
  userTrust: 'Custom',
  seatHint: 'Agent preset for the session you are about to start',
  headerHint: 'The agent preset this session runs, fixed when it started',
  nav: 'Agent presets',
  sectionIntro:
    'A preset is the plugin composition one session\'s agent runs — its tools, prompt, and capabilities. '
    + 'Duplicate an existing one and make it yours, or let the agent draft one for you in Creator mode.',
  builtIn: 'Built-in',
  setDefault: 'Set as default',
  view: 'View',
  presetStandardName: 'Standard mode',
  presetStandardDescription:
    'Full coding agent with file editing, shell, file and web search, skills, planning, goals, subagents, and workflows.',
  presetPtcName: 'PTC mode',
  presetPtcDescription:
    'Full coding agent without the workflow tool; other tools are exposed through the PTC mode SDK so the model can combine multi-step operations in one TypeScript program.',
  presetMinimalName: 'Minimal mode',
  presetMinimalDescription:
    'Single-tool coding agent with a persistent shell.',
  presetCordisName: 'Creator mode',
  presetCordisDescription:
    'Built for creating custom agent presets, with all Standard mode capabilities plus runtime inspection, persistent plugin management, and preset-authoring guidance.',
  duplicate: 'Duplicate',
  duplicateUnavailable: 'This deployment has no writable preset directory',
  delete: 'Delete',
  presetId: 'Identifier',
  presetIdPlaceholder: 'my-agent',
  displayName: 'Name',
  displayNamePlaceholder: 'Shown in the picker; defaults to the identifier',
  inUse: 'New task default',
  selectionOffDefault: 'Default',
  builtInGroup: 'Built-in',
  customGroup: 'Custom',
  noDescription: 'No description.',
  brokenBadge: 'Failed to load',
  brokenNoCopy: 'A preset that failed to load cannot be duplicated',
  switchRefused: 'Could not switch to {name}: {reason}',
  copyOf: 'Copied from',
  composition: 'Composition (agent.cordis.yml)',
  cancel: 'Cancel',
  close: 'Close',
  retry: 'Retry',
  copyTitle: 'Duplicate preset',
  copyIntro:
    'The whole preset is copied on this machine. The identifier becomes its directory name and cannot '
    + 'be changed later; everything else is edited in the preset\'s own files.',
  create: 'Create',
  creating: 'Creating…',
  creatorDraft: 'Draft a custom preset with Creator mode',
  openLocation: 'Open folder',
  showLocation: 'Show location',
  revealedPathLabel: 'Preset files:',
  idRequired: 'Give the preset an identifier.',
  idInvalid: 'Use lowercase letters, digits, and hyphens, starting with a letter or digit.',
  idTaken: 'A preset with this identifier already exists.',
  deleteTitle: 'Delete this preset?',
  deleteDescription:
    'The preset directory is deleted. Sessions already running on it keep working; new sessions cannot select it.',
  deleteConfirm: 'Delete',
  deleting: 'Deleting…',
  showPicker: 'Allow switching Agent modes',
  showPickerBeta: 'Beta',
  showPickerDescription:
    'When enabled, new tasks can choose Standard, PTC, Creator, Minimal, and custom modes. When disabled, all new tasks use the default mode (Standard by default; configurable). Only affects new tasks.',
  enablePickerToSetDefault: 'Turn on Agent mode selection to choose a default',
  enablePickerToCreate: 'Turn on Agent mode selection to start Creator mode',
}

/** Arabic copy. */
export const ar: Record<AgentPresetSettingsKey, string> = {
  error: 'لا يمكن تحميل Agent مسبق ضبط.',
  userTrust: 'ذاتي تعريف',
  seatHint: 'أي سوف بدء هذا عدد جلسة الذي استخدام Agent مسبق ضبط',
  headerHint: 'هذا جلسة تشغيل Agent مسبق ضبط، بدء وقت أي ثابت',
  nav: 'Agent مسبق ضبط',
  sectionIntro: 'مسبق ضبط أي واحد جلسة Agent الذي تشغيل إضافة تجميع —— هو أداة، نص التوجيه و قدرة. نسخ واحد نسخة قائم مسبق ضبط تعديل صار ذاتي ذات، أو استخدام «إنشاء صنع نمط» يجعل Agent مساعدة أنت إنشاء.',
  builtIn: 'داخل وضع',
  setDefault: 'ضبط لـ افتراضي',
  view: 'فحص نظر',
  presetStandardName: 'معيار نمط',
  presetStandardDescription: 'وظيفة كامل تحرير رمز Agent، دعم حمل ملف تحرير،Shell، ملف و شبكة صفحة فحص بحث،Skills، حساب تخطيط، هدف، فرعي بديل إدارة و سير العمل.',
  presetPtcName: 'PTC نمط',
  presetPtcDescription: 'وظيفة كامل تحرير رمز Agent، لكن افتراضي لا توفير workflow أداة؛ أخرى أداة عبر PTC نمط SDK عرض، يجعل نموذج استخدام واحد TypeScript برنامج تركيب كثير خطوة عملية.',
  presetMinimalName: 'أقصى بسيط نمط',
  presetMinimalDescription: 'فقط توفير حمل دائم shell مفرد أداة تحرير رمز Agent.',
  presetCordisName: 'إنشاء صنع نمط',
  presetCordisDescription: 'لأجل إنشاء ذاتي تعريف Agent preset: أداة تجهيز معيار نمط الكل قدرة، و توفير وقت التشغيل فحص، حفظ دائم إضافة إدارة و preset إنشاء عمل إشارة توجيه.',
  duplicate: 'نسخ',
  duplicateUnavailable: 'هذا نشر لم إعداد يمكن كتابة مسبق ضبط دليل',
  delete: 'حذف',
  presetId: 'معرف رمز',
  presetIdPlaceholder: 'my-agent',
  displayName: 'اسم',
  displayNamePlaceholder: 'اختيار جهاز في عرض اسم حرف، نقص حذف استخدام معرف رمز',
  inUse: 'جديد مهمة افتراضي',
  selectionOffDefault: 'افتراضي',
  builtInGroup: 'داخل وضع',
  customGroup: 'ذاتي تعريف',
  noDescription: 'مؤقت بلا وصف.',
  brokenBadge: 'تحميل فشل',
  brokenNoCopy: 'مسبق ضبط تحميل فشل، لا يستطيع نسخ',
  switchRefused: 'لا يمكن تبديل إلى «{name}»:{reason}',
  copyOf: 'نسخ ذاتي',
  composition: 'تجميع (agent.cordis.yml)',
  cancel: 'إلغاء',
  close: 'إغلاق',
  retry: 'إعادة محاولة',
  copyTitle: 'نسخ مسبق ضبط',
  copyIntro: 'كامل مسبق ضبط سوف في هذا آلة نسخ واحد نسخة. معرف رمز سوف يصبح دليل اسم، أمر بعد لا يمكن أكثر تعديل؛ ذلك بقية محتوى بعد مباشر في مسبق ضبط ذاتي ذات ملف داخل تحرير.',
  create: 'إنشاء',
  creating: 'صحيح في إنشاء…',
  creatorDraft: 'استخدام «إنشاء صنع نمط» إنشاء عمل ذاتي تعريف مسبق ضبط',
  openLocation: 'فتح دليل',
  showLocation: 'فحص نظر مسار',
  revealedPathLabel: 'مسبق ضبط ملف:',
  idRequired: 'طلب ملء كتابة معرف رمز.',
  idInvalid: 'فقط قدرة استخدام صغير كتابة حرف أم، عدد حرف و وصل محرف، كما بـ حرف أم أو عدد حرف فتح رأس.',
  idTaken: 'هذا معرف رمز قد يتم احتلال استخدام.',
  deleteTitle: 'حذف هذا مسبق ضبط؟',
  deleteDescription: 'مسبق ضبط دليل سوف يتم حذف. قد في ذلك فوق تشغيل جلسة لا تلقي أثر؛ جديد جلسة سوف لا يمكن مجددا اختيار هو.',
  deleteConfirm: 'حذف',
  deleting: 'صحيح في حذف…',
  showPicker: 'سماح تبديلagentنمط',
  showPickerBeta: 'beta',
  showPickerDescription: 'فتح بدء بعد، جديد مهمة اختياري اختيار معيار،PTC، إنشاء صنع، أقصى بسيط و ذاتي تعريف نمط؛ إغلاق بعد موحد واحد استخدام افتراضي نمط (افتراضي لـ معيار نمط، يمكن ذاتي تعريف). فقط أثر جديد مهمة.',
  enablePickerToSetDefault: 'طلب أولا فتح بدء Agent نمط اختيار، مجددا ضبط افتراضي نمط',
  enablePickerToCreate: 'طلب أولا فتح بدء Agent نمط اختيار، مجددا بدء إنشاء صنع نمط',
}

// The resolution itself is the shared fold in `dsh-agent-presets/display`,
// re-exported here so every surface in this plugin reads one path; the
// Settings plugin list inlines the same fold over this plugin's dictionaries.
export { presetDisplayText } from '@deepseek-ai/dsh-agent-presets/display'
export type { PresetDisplaySource, PresetDisplayText } from '@deepseek-ai/dsh-agent-presets/display'
