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

/** Simplified Chinese copy. */
export const zh: Record<PluginsSettingsLocaleKey, string> = {
  nav: 'داخل وضع إضافة',
  title: 'داخل وضع إضافة',
  intro: 'فحص نظر داخل وضع نشر إضافة قائمة',
  tabs: 'إضافة عرض',
  empty: 'هذا نشر لا يوجد فتح وضع أي إضافة عرض.',
  overridden: 'قد تغطية',
  reset: 'استعادة افتراضي',
  readOnly: 'هذا نشر ضبط لـ فقط قراءة.',
  unavailable: 'هذا إضافة حالي لم تحميل، مؤقت وقت لا يمكن إعداد.',
  save: 'حفظ',
  saving: 'حفظ في…',
  saveFailed: 'هذا نشر لا يوجد قبول هذه قيمة، قد إبقاء توفير أنت تعديل.',
  invalidNumber: 'طلب ملء عدد حرف؛ إبقاء فارغ يمثل استخدام قيمة افتراضية.',
  bashTitle: 'طرفية',
  bashDescription: 'حد agent تشغيل كل واحد بند أمر.',
  bashTimeoutMs: 'أمر مهلة (جزء ثانية)',
  bashTimeoutMsHint: 'مفرد بند أمر سماح تشغيل كثير دائم، مهلة أي إنهاء.',
  bashMaxOutputBytes: 'مفرد تدفق إخراج حد أعلى (بايت)',
  bashMaxOutputBytesHint: 'تجاوز خروج جزء سوف تحويل تخزين إلى مؤقت ملف، بينما لا هو يتم إسقاط.',
  agentLoopTitle: 'Agent حلقة',
  agentLoopDescription: 'Agent مثل أي إرسال إرسال أداة استدعاء.',
  agentLoopMaxParallel: 'و سطر أداة استدعاء عدد',
  agentLoopMaxParallelHint: 'نفس خطوة داخل الأكثر كثير معا تشغيل كثير قليل عدد يمكن و سطر استدعاء.',
  webSearchTitle: 'شبكة صفحة بحث',
  webSearchDescription: 'DeepSeek بحث مزود.',
  webSearchApiKey: 'API Key',
  webSearchApiKeyHint: 'لا كتابة ضبط ملف. إبقاء فارغ يمثل إبقاء حالي مفتاح.',
  webSearchApiKeySet: 'قد إعداد مفتاح.',
  webSearchApiKeyUnset: 'لم إعداد مفتاح؛ إعداد قبل بحث غير ممكن استخدام.',
  webSearchBaseUrl: 'واجهة عنوان',
  webSearchBaseUrlHint: 'إبقاء فارغ فإن استخدام مزود افتراضي عنوان.',
  webSearchMaxUses: 'مفرد مرة طلب الأكثر كثير بحث مرة عدد',
  webSearchMaxUsesHint: 'مرة طلب في يجب عمل جواب قبل الأكثر كثير يمكن بحث كثير قليل مرة.',
  subagentTitle: 'Subagent',
  subagentDescription: 'ضبط Subagent تمرير عودة طبقة درجة، عدد كمية و نموذج.',
  subagentLimitsTitle: 'تشغيل حد',
  subagentMaxDepth: 'الأكثر كبير تمرير عودة عميق درجة',
  subagentDepthHelpLabel: 'الأكثر كبير تمرير عودة عميق درجة شرح',
  subagentDepthHelp: 'حد Agent إنشاء Subagent تمرير عودة طبقة درجة.',
  subagentDepthZero: 'منع استخدام Subagent',
  subagentDepthOne: 'فقط سماح رئيسي Agent إنشاء Subagent',
  subagentDepthOverride: 'إذا بعض عدد أداة مفرد وحيد ضبط الأكثر كبير تمرير عودة عميق درجة، بـ هذا أداة ضبط لـ دقيق.',
  subagentMaxActive: 'Subagent و سطر عدد كمية حد أعلى',
  subagentCapacityHelpLabel: 'Subagent و سطر عدد كمية حد أعلى شرح',
  subagentCapacityHelp: 'نفس رئيسي Agent تحت، كل تمرير عودة طبقة درجة معا تخزين نشط Subagent مجموع عدد، رئيسي Agent لا حساب دخول. بلوغ إلى حد أعلى وقت، جديد بدء طلب سوف يتم رفض.',
  subagentDepthInvalid: 'طلب إدخال لا صغير في 0 كامل عدد.',
  subagentCapacityInvalid: 'طلب إدخال لا صغير في 1 كامل عدد.',
  subagentModelSelectionTitle: 'نموذج اختيار',
  subagentModelSelectionToggle: 'سماح Agent لـ Subagent اختيار نموذج',
  subagentModelSelectionChoose: 'فتح بدء بعد،Agent يمكن من تحت جهة تخويل نموذج في، لـ كل Subagent اختيار مزود، نموذج و دفع إدارة قوي درجة. فقط أثر جديد جلسة.',
  subagentModelSelectionAllowed: 'Agent اختياري اختيار نموذج',
  subagentModelSelectionLoading: 'صحيح في تحميل نموذج…',
  subagentModelSelectionLoadFailed: 'لا يمكن تحميل نموذج.',
  subagentModelSelectionRetry: 'إعادة محاولة',
  subagentModelSelectionPartial: 'جزء نموذج مزود مؤقت وقت لا يمكن تحميل؛ قد حفظ اختيار ما زال يمكن إزالة.',
  subagentModelSelectionUnavailable: 'حالي غير ممكن استخدام',
  subagentModelSelectionUnavailableGroup: 'قد حفظ لكن حالي غير ممكن استخدام',
  subagentModelSelectionEmpty: 'حالي لا يوجد نموذج مزود عام نشر نموذج.',
  subagentModelSelectionRequired: 'حفظ قبل طلب حتى قليل اختيار واحد نموذج.',
  subagentModelSelectionConflict: 'ضبط قد في أخرى موضع تحديث. طلب وضع ترك تعديل بعد إعادة محاولة.',
  subagentModelSelectionOff: 'إغلاق بعد،Subagent استخدام إعداد افتراضي نموذج أو وراثة أب Agent نموذج؛ قد اختيار نموذج سوف إبقاء.',
}
