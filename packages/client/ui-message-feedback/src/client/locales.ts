/** `feedback` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'action.like': 'جيد عودة جواب',
  'action.likeActive': 'إلغاء علامة',
  'action.dislike': 'لديه مشكلة عودة جواب',
  'action.dislikeActive': 'إلغاء علامة',
  'dialog.title': 'إيداع عكس تغذية',
  'dialog.categories': 'عكس تغذية تصنيف',
  'dialog.detail': 'عكس تغذية تفصيل حال',
  'dialog.hint': 'ملء كتابة تفصيل حال بـ مساعدة مساعدة أنا جمع تعديل دخول تجربة، إيداع محتوى سوف يشمل حالي محادثة سجل',
  'category.task-result': 'مهمة نتيجة',
  'category.instruction-following': 'إشارة أمر إدارة حل و التزام دوران',
  'category.product-interaction': 'منتج وظيفة و تفاعل',
  'category.service-stability': 'مستقر صفة و سرعة درجة',
  'category.resource-cost': 'مورد استخدام و استهلاك استخدام',
  'category.security-privacy-permission': 'أمان خفي خاص و إذن',
  'category.other': 'أخرى',
  'toast.recorded': 'شعور شكر أنت عكس تغذية',
  'error.conflict': 'هذا بند عكس تغذية قد في آخر موضع تعديل، قد عرض الأكثر جديد حالة',
  'error.load': 'عكس تغذية حالة تحميل فشل',
  'error.generic': 'عكس تغذية حفظ فشل',
  'error.noteTooLarge': 'وصف جدا طويل، طلب تقليص قصير بعد مجددا إيداع',
} satisfies Record<string, string>

/** The feedback namespace key union. */
export type MessageFeedbackKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The feedback surface's copy: the message controls, the dialog, and the acknowledgement. */
    feedback: MessageFeedbackKey
  }
}

/** English dictionary, checked complete against the zh key set. */
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
