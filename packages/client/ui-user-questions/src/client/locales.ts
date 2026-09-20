/** `question` namespace dictionaries. */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'error.incomplete': 'أكمِل هذا السؤال أولًا.',
  'error.unanswered': 'اختر أحد الخيارات أو اكتب إجابة خاصة بك.',
  'nav.prev': 'السؤال السابق',
  'nav.next': 'السؤال التالي',
  'nav.minimize': 'طي بطاقة السؤال',
  'nav.maximize': 'توسيع بطاقة السؤال',
  'nav.cancel': 'تجاهل كل الأسئلة',
  'option.recommended': 'موصى به',
  'custom.placeholder': 'اكتب إجابتك',
  'action.skip': 'تخطّي',
  'action.next': 'التالي',
  'plan.header': 'مراجعة الخطة',
  'plan.approve': 'موافقة',
  'plan.decline': 'رفض',
  'plan.discuss': 'طلب تعديلات',
} satisfies Record<string, string>

/** The question namespace key union. */
export type QuestionKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
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
