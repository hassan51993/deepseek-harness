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
  'command.description': 'اختيار هذا جلسة استخدام نموذج',
  'option.loadError': 'دليل تحميل فشل:{message}',
  'option.deepseekV4Flash.description': 'سريع سرعة، عال فاعلية كما مرور عون؛ ملائم دمج هدف واضح، معتاد قاعدة أو و سطر مهمة.',
  'option.deepseekV4Pro.description': 'أكثر قوي ذاتي رئيسي تحرير رمز، معرفة تعرف و تكرار مختلط دفع إدارة قدرة؛ ملائم دمج تكرار مختلط أو جودة كمية أولوية مهمة، لكن صار هذا أكثر عال.',
  'trigger.fallback': 'اختيار نموذج',
  'trigger.loading': 'جارٍ تحميل نموذج…',
  'trigger.selectAria': 'اختيار نموذج',
  'trigger.aria': 'اختيار نموذج، حالي {model}',
  'trigger.ariaEffort': 'اختيار نموذج، حالي {model}، دفع إدارة انتظار درجة {effort}',
  'menu.aria': 'نموذج و دفع إدارة انتظار درجة',
  'menu.model': 'نموذج',
  'menu.effort': 'دفع إدارة انتظار درجة',
  'effort.providerDefault': 'Default',
  'status.loading': 'جارٍ تحديث جديد نموذج قائمة…',
  'error.action': 'نموذج عملية فشل:{message}',
  'error.sessionInUse': 'حالي جلسة قد يتم احتلال استخدام، ممكن هو أخرى جارٍ تشغيل DSH توجيه يؤدي (مثل أخرى dsh web، طاولة وجه طرف) ، طلب خروج أخرى جارٍ تشغيل DSH بعد إعادة محاولة.',
  'action.reload': 'إعادة تحميل',
  'warning.groupLoad': '{name} تحميل فشل:{message}',
  'empty.models': 'لا يوجد متاح نموذج.',
  'blocked.composer': 'حالي نموذج غير ممكن استخدام، طلب أولا اختيار نموذج',
  'empty.efforts': 'حالي نموذج لم توفير دفع إدارة انتظار درجة.',
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
