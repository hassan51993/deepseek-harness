/** `question` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'error.incomplete': 'طلب أولا إتمام هذا طريق مشكلة.',
  'error.unanswered': 'طلب اختيار واحد خيار أو ملء كتابة ذاتي تعريف جواب سجل.',
  'nav.prev': 'فوق واحد عنوان',
  'nav.next': 'تحت واحد عنوان',
  'nav.minimize': 'استلام بدء مشكلة بطاقة',
  'nav.maximize': 'توسيع مشكلة بطاقة',
  'nav.cancel': 'وضع ترك كامل مجموعة مشكلة',
  'option.recommended': 'دفع ترشيح',
  'custom.placeholder': 'إدخال أنت جواب سجل',
  'action.skip': 'قفز مرور',
  'action.next': 'تحت واحد عنوان',
  'plan.header': 'حساب تخطيط انتظار مراجعة',
  'plan.approve': 'نفس معنى تنفيذ',
  'plan.decline': 'رفض',
  'plan.discuss': 'اشتراط تعديل',
} satisfies Record<string, string>

/** The question namespace key union. */
export type QuestionKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'error.incomplete': 'Please complete this question first.',
  'error.unanswered': 'Please select an option or enter a custom answer.',
  'nav.prev': 'Previous question',
  'nav.next': 'Next question',
  'nav.minimize': 'Collapse the question card',
  'nav.maximize': 'Expand the question card',
  'nav.cancel': 'Dismiss all questions',
  'option.recommended': 'Recommended',
  'custom.placeholder': 'Type your answer',
  'action.skip': 'Skip',
  'action.next': 'Next',
  'plan.header': 'Plan review',
  'plan.approve': 'Approve',
  'plan.decline': 'Refuse',
  'plan.discuss': 'Request changes',
} satisfies Record<QuestionKey, string>
