/**
 * `model` namespace dictionaries.
 *
 * `trigger.selectAria` intentionally matches `trigger.fallback` but remains a
 * separate key: the visible fallback label and the accessible name of
 * an unset trigger are free to diverge per locale, and folding it into
 * `trigger.aria` would announce the degenerate "Select model, current Select
 * model".
 */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'command.label': 'نموذج',
  'command.description': 'اختيار النموذج المستخدم في هذه المحادثة',
  'option.loadError': 'تعذّر تحميل الكتالوج: {message}',
  'option.deepseekV4Flash.description': 'سريع وفعّال واقتصادي؛ مناسب للمهام المحدّدة أو الروتينية أو المتوازية.',
  'option.deepseekV4Pro.description': 'أقوى في البرمجة الوكيلة والمعرفة والاستدلال الصعب؛ مناسب للمهام المعقّدة أو الحسّاسة للجودة، بتكلفة أعلى.',
  'trigger.fallback': 'اختيار نموذج',
  'trigger.loading': 'جارٍ تحميل النماذج…',
  'trigger.selectAria': 'اختيار نموذج',
  'trigger.aria': 'اختيار نموذج، الحالي {model}',
  'trigger.ariaEffort': 'اختيار نموذج، الحالي {model}، جهد الاستدلال {effort}',
  'menu.aria': 'النموذج وجهد الاستدلال',
  'menu.model': 'النموذج',
  'menu.effort': 'جهد الاستدلال',
  'effort.providerDefault': 'الافتراضي',
  'status.loading': 'جارٍ تحديث قائمة النماذج…',
  'error.action': 'فشلت عملية النموذج: {message}',
  'error.sessionInUse': 'هذه الجلسة مستخدَمة بالفعل، ربما من نسخة DSH أخرى قيد التشغيل (مثل dsh web أو تطبيق سطح المكتب). أغلِق نسخ DSH الأخرى ثم أعد المحاولة.',
  'action.reload': 'إعادة التحميل',
  'warning.groupLoad': 'تعذّر تحميل {name}: {message}',
  'empty.models': 'لا توجد نماذج متاحة.',
  'blocked.composer': 'هذا النموذج غير متاح — اختر نموذجًا للمتابعة',
  'empty.efforts': 'هذا النموذج لا يوفّر مستويات لجهد الاستدلال.',
} satisfies Record<string, string>

/** The model namespace key union. */
export type ModelKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'command.label': 'Model',
  'command.description': 'Select the model for this conversation',
  'option.loadError': 'Catalog failed to load: {message}',
  'option.deepseekV4Flash.description': 'Fast, efficient, and economical; suited to focused, routine, or parallel tasks.',
  'option.deepseekV4Pro.description': 'Stronger agentic coding, knowledge, and difficult reasoning; suited to complex or quality-critical tasks at higher cost.',
  'trigger.fallback': 'Select model',
  'trigger.loading': 'Loading models…',
  'trigger.selectAria': 'Select model',
  'trigger.aria': 'Select model, current {model}',
  'trigger.ariaEffort': 'Select model, current {model}, reasoning effort {effort}',
  'menu.aria': 'Model and reasoning effort',
  'menu.model': 'Model',
  'menu.effort': 'Effort',
  'effort.providerDefault': 'Default',
  'status.loading': 'Refreshing model list…',
  'error.action': 'Model operation failed: {message}',
  'error.sessionInUse': 'This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.',
  'action.reload': 'Reload',
  'warning.groupLoad': '{name} failed to load: {message}',
  'empty.models': 'No models available.',
  'blocked.composer': 'This model is unavailable — select one to continue',
  'empty.efforts': 'This model provides no reasoning effort levels.',
} satisfies Record<ModelKey, string>
