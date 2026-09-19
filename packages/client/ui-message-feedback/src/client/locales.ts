/** `feedback` namespace dictionaries. */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'action.like': 'رد جيد',
  'action.likeActive': 'إزالة التقييم',
  'action.dislike': 'رد سيئ',
  'action.dislikeActive': 'إزالة التقييم',
  'dialog.title': 'إرسال ملاحظات',
  'dialog.categories': 'فئة الملاحظات',
  'dialog.detail': 'تفاصيل الملاحظات',
  'dialog.hint': 'أضِف تفاصيل تساعدنا على التحسين. سيتضمّن ما ترسله سجل المحادثة الحالي.',
  'category.task-result': 'نتيجة المهمة',
  'category.instruction-following': 'فهم التعليمات والالتزام بها',
  'category.product-interaction': 'ميزات المنتج والتفاعل',
  'category.service-stability': 'الاستقرار والسرعة',
  'category.resource-cost': 'استهلاك الموارد والتكلفة',
  'category.security-privacy-permission': 'الأمان والخصوصية والأذونات',
  'category.other': 'أخرى',
  'toast.recorded': 'شكرًا على ملاحظاتك',
  'error.conflict': 'تغيّرت هذه الملاحظات في مكان آخر؛ هذه أحدث حالة لها',
  'error.load': 'تعذّر تحميل الملاحظات',
  'error.generic': 'تعذّر حفظ الملاحظات',
  'error.noteTooLarge': 'الوصف طويل جدًا؛ اختصره ثم أرسِله مرة أخرى',
} satisfies Record<string, string>

/** The feedback namespace key union. */
export type MessageFeedbackKey = keyof typeof ar

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The feedback surface's copy: the message controls, the dialog, and the acknowledgement. */
    feedback: MessageFeedbackKey
  }
}

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'action.like': 'Good response',
  'action.likeActive': 'Remove rating',
  'action.dislike': 'Bad response',
  'action.dislikeActive': 'Remove rating',
  'dialog.title': 'Submit feedback',
  'dialog.categories': 'Feedback category',
  'dialog.detail': 'Feedback details',
  'dialog.hint': 'Add details to help us improve. Your submission will include the current conversation log.',
  'category.task-result': 'Task result',
  'category.instruction-following': 'Instruction understanding and following',
  'category.product-interaction': 'Product features and interaction',
  'category.service-stability': 'Stability and speed',
  'category.resource-cost': 'Resource usage and cost',
  'category.security-privacy-permission': 'Security, privacy, and permissions',
  'category.other': 'Other',
  'toast.recorded': 'Thanks for your feedback',
  'error.conflict': 'This feedback changed elsewhere; the latest state is shown',
  'error.load': 'Could not load feedback',
  'error.generic': 'Could not save feedback',
  'error.noteTooLarge': 'The description is too long; shorten it and submit again',
} satisfies Record<MessageFeedbackKey, string>
