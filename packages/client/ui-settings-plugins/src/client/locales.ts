/** Locale bundles for the built-in plugins settings section and the plugin configuration pages. */

/** Locale keys these surfaces render. */
export type PluginsSettingsLocaleKey =
  | 'nav' | 'title' | 'intro' | 'tabs' | 'empty'
  | 'overridden' | 'reset' | 'readOnly' | 'unavailable'
  | 'save' | 'saving' | 'saveFailed' | 'invalidNumber'
  | 'bashTitle' | 'bashDescription' | 'bashTimeoutMs' | 'bashTimeoutMsHint'
  | 'bashMaxOutputBytes' | 'bashMaxOutputBytesHint'
  | 'agentLoopTitle' | 'agentLoopDescription' | 'agentLoopMaxParallel' | 'agentLoopMaxParallelHint'
  | 'webSearchTitle' | 'webSearchDescription'
  | 'webSearchApiKey' | 'webSearchApiKeyHint' | 'webSearchApiKeySet' | 'webSearchApiKeyUnset'
  | 'webSearchBaseUrl' | 'webSearchBaseUrlHint' | 'webSearchMaxUses' | 'webSearchMaxUsesHint'
  | 'subagentTitle' | 'subagentDescription' | 'subagentLimitsTitle'
  | 'subagentMaxDepth'
  | 'subagentDepthHelpLabel' | 'subagentDepthHelp'
  | 'subagentDepthZero' | 'subagentDepthOne' | 'subagentDepthOverride'
  | 'subagentMaxActive'
  | 'subagentCapacityHelpLabel' | 'subagentCapacityHelp'
  | 'subagentDepthInvalid'
  | 'subagentCapacityInvalid'
  | 'subagentModelSelectionTitle'
  | 'subagentModelSelectionToggle' | 'subagentModelSelectionChoose' | 'subagentModelSelectionAllowed'
  | 'subagentModelSelectionLoading' | 'subagentModelSelectionLoadFailed' | 'subagentModelSelectionRetry'
  | 'subagentModelSelectionPartial' | 'subagentModelSelectionUnavailable'
  | 'subagentModelSelectionUnavailableGroup' | 'subagentModelSelectionEmpty'
  | 'subagentModelSelectionRequired' | 'subagentModelSelectionConflict' | 'subagentModelSelectionOff'

/** English copy. */
export const en: Record<PluginsSettingsLocaleKey, string> = {
  nav: 'Built-in plugins',
  title: 'Built-in plugins',
  intro: 'Inspect the plugins this deployment ships.',
  tabs: 'Plugin views',
  empty: 'This deployment exposes no plugin views.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  readOnly: 'This deployment stores settings read-only.',
  unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
  save: 'Save',
  saving: 'Saving…',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
  invalidNumber: 'Enter a number, or leave blank to use the default.',
  bashTitle: 'Shell',
  bashDescription: 'Limits every command the agent runs.',
  bashTimeoutMs: 'Command timeout (ms)',
  bashTimeoutMsHint: 'How long one command may run before it is terminated.',
  bashMaxOutputBytes: 'Output cap per stream (bytes)',
  bashMaxOutputBytesHint: 'Output beyond this spills to a temporary file rather than being lost.',
  agentLoopTitle: 'Agent loop',
  agentLoopDescription: 'How the agent dispatches tool calls.',
  agentLoopMaxParallel: 'Parallel tool calls',
  agentLoopMaxParallelHint: 'Upper bound on parallel-safe calls running at once within one step.',
  webSearchTitle: 'Web search',
  webSearchDescription: 'The DeepSeek search provider.',
  webSearchApiKey: 'API key',
  webSearchApiKeyHint: 'Stored outside the settings file. Leave blank to keep the current key.',
  webSearchApiKeySet: 'A key is configured.',
  webSearchApiKeyUnset: 'No key is configured; search is unavailable until one is.',
  webSearchBaseUrl: 'Endpoint',
  webSearchBaseUrlHint: 'Leave blank to use the provider default.',
  webSearchMaxUses: 'Max searches per request',
  webSearchMaxUsesHint: 'How many times one request may search before it must answer.',
  subagentTitle: 'Subagent',
  subagentDescription: 'Set Subagent recursion depth, count, and models.',
  subagentLimitsTitle: 'Limits',
  subagentMaxDepth: 'Maximum recursion depth',
  subagentDepthHelpLabel: 'About maximum recursion depth',
  subagentDepthHelp: 'Limits how many levels of Subagents an Agent can create.',
  subagentDepthZero: 'Disable Subagents',
  subagentDepthOne: 'Only the main Agent can create Subagents',
  subagentDepthOverride: 'If a tool defines its own maximum recursion depth, that setting takes precedence.',
  subagentMaxActive: 'Subagent parallelism limit',
  subagentCapacityHelpLabel: 'About the Subagent parallelism limit',
  subagentCapacityHelp: 'Total live Subagents under the same main Agent, across all recursion levels. The main Agent is excluded. New start requests are rejected when the limit is reached.',
  subagentDepthInvalid: 'Enter a whole number of 0 or more.',
  subagentCapacityInvalid: 'Enter a whole number of 1 or more.',
  subagentModelSelectionTitle: 'Model selection',
  subagentModelSelectionToggle: 'Allow agents to choose models for Subagents',
  subagentModelSelectionChoose: 'When enabled, agents can choose a provider, model, and reasoning effort for each Subagent from the authorized models below. Applies only to new sessions.',
  subagentModelSelectionAllowed: 'Models agents may choose',
  subagentModelSelectionLoading: 'Loading models…',
  subagentModelSelectionLoadFailed: 'Models could not be loaded.',
  subagentModelSelectionRetry: 'Retry',
  subagentModelSelectionPartial: 'Some model providers could not be loaded; saved choices remain removable.',
  subagentModelSelectionUnavailable: 'Currently unavailable',
  subagentModelSelectionUnavailableGroup: 'Saved but currently unavailable',
  subagentModelSelectionEmpty: 'No model provider currently advertises a model.',
  subagentModelSelectionRequired: 'Select at least one model before saving.',
  subagentModelSelectionConflict: 'Settings changed elsewhere. Discard your draft and try again.',
  subagentModelSelectionOff: 'Subagents use configured defaults or inherit the parent agent\'s model. Saved model choices are retained.',
}

/** Arabic copy. */
export const ar: Record<PluginsSettingsLocaleKey, string> = {
  nav: 'الإضافات المدمجة',
  title: 'الإضافات المدمجة',
  intro: 'اطّلع على الإضافات التي يشحنها هذا النشر.',
  tabs: 'عروض الإضافات',
  empty: 'لا يعرض هذا النشر أي عرض إضافات.',
  overridden: 'متجاوَز',
  reset: 'إعادة التعيين إلى الافتراضي',
  readOnly: 'يخزّن هذا النشر الإعدادات للقراءة فقط.',
  unavailable: 'هذه الإضافة غير محمّلة، فلا يمكن إعدادها الآن.',
  save: 'حفظ',
  saving: 'جارٍ الحفظ…',
  saveFailed: 'لم يقبل النشر هذه القيم، وتُركت لك لتصحيحها.',
  invalidNumber: 'أدخل رقمًا، أو اترك الحقل فارغًا لاستخدام القيمة الافتراضية.',
  bashTitle: 'الصدفة',
  bashDescription: 'يحدّ كل أمر يشغّله الوكيل.',
  bashTimeoutMs: 'مهلة الأمر (م.ث)',
  bashTimeoutMsHint: 'المدة التي يُسمح فيها لأمر واحد بالعمل قبل إنهائه.',
  bashMaxOutputBytes: 'حد الإخراج لكل تدفّق (بايت)',
  bashMaxOutputBytesHint: 'ما يتجاوز هذا الحد يُحفظ في ملف مؤقت بدل أن يضيع.',
  agentLoopTitle: 'حلقة الوكيل',
  agentLoopDescription: 'كيف يوزّع الوكيل استدعاءات الأدوات.',
  agentLoopMaxParallel: 'استدعاءات الأدوات المتوازية',
  agentLoopMaxParallelHint: 'الحد الأقصى للاستدعاءات الآمنة التي تعمل معًا في خطوة واحدة.',
  webSearchTitle: 'البحث في الويب',
  webSearchDescription: 'مزوّد البحث من DeepSeek.',
  webSearchApiKey: 'مفتاح API',
  webSearchApiKeyHint: 'يُحفظ خارج ملف الإعدادات. اترك الحقل فارغًا للإبقاء على المفتاح الحالي.',
  webSearchApiKeySet: 'تم إعداد مفتاح.',
  webSearchApiKeyUnset: 'لم يُعدّ أي مفتاح؛ والبحث غير متاح حتى يُعدّ واحد.',
  webSearchBaseUrl: 'عنوان الخدمة',
  webSearchBaseUrlHint: 'اترك الحقل فارغًا لاستخدام العنوان الافتراضي للمزوّد.',
  webSearchMaxUses: 'أقصى عدد عمليات بحث لكل طلب',
  webSearchMaxUsesHint: 'كم مرة يمكن للطلب الواحد أن يبحث قبل أن يجيب.',
  subagentTitle: 'الوكيل الفرعي',
  subagentDescription: 'ضبط عمق التداخل وعدد الوكلاء الفرعيين ونماذجهم.',
  subagentLimitsTitle: 'الحدود',
  subagentMaxDepth: 'أقصى عمق للتداخل',
  subagentDepthHelpLabel: 'عن أقصى عمق للتداخل',
  subagentDepthHelp: 'يحدّ عدد المستويات التي يمكن للوكيل أن ينشئ فيها وكلاء فرعيين.',
  subagentDepthZero: 'تعطيل الوكلاء الفرعيين',
  subagentDepthOne: 'الوكيل الرئيسي وحده ينشئ وكلاء فرعيين',
  subagentDepthOverride: 'إذا حدّدت أداةٌ أقصى عمق تداخل خاصًّا بها، فإعداد الأداة هو الذي يسري.',
  subagentMaxActive: 'حد التوازي للوكلاء الفرعيين',
  subagentCapacityHelpLabel: 'عن حد التوازي للوكلاء الفرعيين',
  subagentCapacityHelp: 'إجمالي الوكلاء الفرعيين العاملين تحت الوكيل الرئيسي نفسه، عبر كل مستويات التداخل، دون احتساب الوكيل الرئيسي. عند بلوغ الحد تُرفض طلبات البدء الجديدة.',
  subagentDepthInvalid: 'أدخل عددًا صحيحًا لا يقل عن 0.',
  subagentCapacityInvalid: 'أدخل عددًا صحيحًا لا يقل عن 1.',
  subagentModelSelectionTitle: 'اختيار النموذج',
  subagentModelSelectionToggle: 'السماح للوكلاء باختيار نماذج للوكلاء الفرعيين',
  subagentModelSelectionChoose: 'عند التفعيل، يمكن للوكلاء اختيار مزوّد ونموذج وجهد استدلال لكل وكيل فرعي من النماذج المصرّح بها أدناه. يسري على الجلسات الجديدة فقط.',
  subagentModelSelectionAllowed: 'النماذج التي يمكن للوكلاء اختيارها',
  subagentModelSelectionLoading: 'جارٍ تحميل النماذج…',
  subagentModelSelectionLoadFailed: 'تعذّر تحميل النماذج.',
  subagentModelSelectionRetry: 'إعادة المحاولة',
  subagentModelSelectionPartial: 'تعذّر تحميل بعض مزوّدي النماذج؛ ولا تزال الاختيارات المحفوظة قابلة للإزالة.',
  subagentModelSelectionUnavailable: 'غير متاح حاليًا',
  subagentModelSelectionUnavailableGroup: 'محفوظ لكنه غير متاح حاليًا',
  subagentModelSelectionEmpty: 'لا يعلن أي مزوّد نماذج عن نموذج حاليًا.',
  subagentModelSelectionRequired: 'اختر نموذجًا واحدًا على الأقل قبل الحفظ.',
  subagentModelSelectionConflict: 'تغيّرت الإعدادات في مكان آخر. تجاهَل مسودّتك وأعد المحاولة.',
  subagentModelSelectionOff: 'يستخدم الوكلاء الفرعيون النماذج الافتراضية المُعدّة أو يرثون نموذج الوكيل الأب؛ وتبقى اختيارات النماذج المحفوظة.',
}
