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
  error: 'تعذّر تحميل الإعدادات المسبقة للوكيل.',
  userTrust: 'مخصّص',
  seatHint: 'الإعداد المسبق للوكيل في الجلسة التي أنت على وشك بدئها',
  headerHint: 'الإعداد المسبق الذي تعمل به هذه الجلسة، وقد تحدّد عند بدئها',
  nav: 'الإعدادات المسبقة للوكيل',
  sectionIntro: 'الإعداد المسبق هو تركيبة الإضافات التي يعمل بها وكيل الجلسة — أدواته وتوجيهه وقدراته. انسخ إعدادًا قائمًا وعدّله كما تشاء، أو دع الوكيل يصوغ لك واحدًا في وضع الإنشاء.',
  builtIn: 'مدمج',
  setDefault: 'تعيينه افتراضيًا',
  view: 'عرض',
  presetStandardName: 'الوضع المعياري',
  presetStandardDescription: 'وكيل برمجة كامل مع تحرير الملفات والصدفة والبحث في الملفات والويب والمهارات والتخطيط والأهداف والوكلاء الفرعيين وسير العمل.',
  presetPtcName: 'وضع PTC',
  presetPtcDescription: 'وكيل برمجة كامل بلا أداة سير العمل؛ تُتاح الأدوات الأخرى عبر SDK وضع PTC ليجمع النموذج عمليات متعدّدة الخطوات في برنامج TypeScript واحد.',
  presetMinimalName: 'الوضع الأدنى',
  presetMinimalDescription: 'وكيل برمجة بأداة واحدة مع صدفة دائمة.',
  presetCordisName: 'وضع الإنشاء',
  presetCordisDescription: 'مُعدّ لإنشاء إعدادات مسبقة مخصّصة للوكيل، بكل قدرات الوضع المعياري إضافةً إلى فحص وقت التشغيل وإدارة الإضافات الدائمة وإرشاد تأليف الإعدادات المسبقة.',
  duplicate: 'نسخ',
  duplicateUnavailable: 'لا يوجد في هذا النشر مجلد إعدادات مسبقة قابل للكتابة',
  delete: 'حذف',
  presetId: 'المعرّف',
  presetIdPlaceholder: 'my-agent',
  displayName: 'الاسم',
  displayNamePlaceholder: 'يظهر في المنتقي؛ يُستخدم المعرّف افتراضيًا',
  inUse: 'افتراضي المهام الجديدة',
  selectionOffDefault: 'افتراضي',
  builtInGroup: 'مدمج',
  customGroup: 'مخصّص',
  noDescription: 'لا يوجد وصف.',
  brokenBadge: 'تعذّر التحميل',
  brokenNoCopy: 'لا يمكن نسخ إعداد مسبق فشل تحميله',
  switchRefused: 'تعذّر التبديل إلى «{name}»: {reason}',
  copyOf: 'منسوخ من',
  composition: 'التركيبة (agent.cordis.yml)',
  cancel: 'إلغاء',
  close: 'إغلاق',
  retry: 'إعادة المحاولة',
  copyTitle: 'نسخ الإعداد المسبق',
  copyIntro: 'يُنسخ الإعداد المسبق كاملًا على هذا الجهاز. يصبح المعرّف اسم مجلده ولا يمكن تغييره لاحقًا؛ أما بقية المحتوى فيُحرَّر في ملفات الإعداد المسبق نفسها.',
  create: 'إنشاء',
  creating: 'جارٍ الإنشاء…',
  creatorDraft: 'صُغ إعدادًا مسبقًا مخصّصًا بوضع الإنشاء',
  openLocation: 'فتح المجلد',
  showLocation: 'عرض الموقع',
  revealedPathLabel: 'ملفات الإعداد المسبق:',
  idRequired: 'أدخل معرّفًا للإعداد المسبق.',
  idInvalid: 'استخدم حروفًا صغيرة وأرقامًا وشرطات، على أن يبدأ بحرف أو رقم.',
  idTaken: 'يوجد بالفعل إعداد مسبق بهذا المعرّف.',
  deleteTitle: 'حذف هذا الإعداد المسبق؟',
  deleteDescription: 'يُحذف مجلد الإعداد المسبق. تواصل الجلسات العاملة به عملها، ولا تستطيع الجلسات الجديدة اختياره.',
  deleteConfirm: 'حذف',
  deleting: 'جارٍ الحذف…',
  showPicker: 'السماح بتبديل أوضاع الوكيل',
  showPickerBeta: 'تجريبي',
  showPickerDescription: 'عند التفعيل، يمكن للمهام الجديدة اختيار الوضع المعياري أو PTC أو الإنشاء أو الأدنى أو وضعًا مخصّصًا. وعند التعطيل، تستخدم كل المهام الجديدة الوضع الافتراضي (المعياري افتراضيًا، وهو قابل للتغيير). يؤثر في المهام الجديدة فقط.',
  enablePickerToSetDefault: 'فعّل اختيار وضع الوكيل أولًا لتحديد وضع افتراضي',
  enablePickerToCreate: 'فعّل اختيار وضع الوكيل أولًا لبدء وضع الإنشاء',
}

// The resolution itself is the shared fold in `dsh-agent-presets/display`,
// re-exported here so every surface in this plugin reads one path; the
// Settings plugin list inlines the same fold over this plugin's dictionaries.
export { presetDisplayText } from '@deepseek-ai/dsh-agent-presets/display'
export type { PresetDisplaySource, PresetDisplayText } from '@deepseek-ai/dsh-agent-presets/display'
