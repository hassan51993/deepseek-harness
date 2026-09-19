/** Copy owned by the sidebar terminal feature. */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    sidebarTerminal: keyof typeof ar
  }
}

/** Arabic terminal copy. */
export const ar = {
  recoveryFailed: 'استعادة طرفية فشل:{message}', retryRecovery: 'إعادة محاولة استعادة طرفية',
  shell: 'اختيار Shell', shellLoading: 'صحيح في قراءة Shell…', shellEmpty: 'لا يوجد متاح Shell', description: 'في جلسة مساحة العمل تشغيل أمر',
  title: 'طرفية', new: 'جديد بناء طرفية', loading: 'صحيح في قراءة طرفية بيئة…', creating: 'صحيح في بدء…',
  connecting: 'صحيح في اتصال…', disconnected: 'اتصال قد قطع فتح.', reconnect: 'إعادة اتصال',
  readonly: 'هذا صفحة حالي فقط قراءة.', control: 'وصل إدارة إدخال',
  closed: 'طرفية قد إغلاق.', exited: 'عملية قد خروج ({code})', failed: 'طرفية خطأ:{message}',
  rename: 'طرفية اسم', unavailable: 'غير ممكن استخدام', retry: 'إعادة محاولة',
  cleanupFailed: 'طرفية «{title}» لم قدرة انتهاء:{message}',
  missingTerminal: 'هذا طرفية قد لا وجود، طلب جديد بناء طرفية.',
  inputFull: 'إدخال مؤقت اندفاع منطقة قد ممتلئ، طلب إعادة اتصال بعد إعادة محاولة.',
  attachmentEnded: 'طرفية اتصال قد انتهاء، طلب إعادة اتصال.',
  invalidOutput: 'طرفية رسم وجه نقل استثناء، طلب إعادة اتصال.',
  terminalLimit: 'طرفية عدد كمية قد بلوغ حد أعلى، طلب إغلاق لا استخدام طرفية بعد إعادة محاولة. قد خروج طرفية أيضا حساب دخول عدد كمية.',
} satisfies Record<string, string>

/** English terminal copy. */
export const en = {
  recoveryFailed: 'Terminal recovery failed: {message}', retryRecovery: 'Retry terminal recovery',
  shell: 'Choose shell', shellLoading: 'Loading shells…', shellEmpty: 'No shells available', description: 'Run commands in the Session workspace',
  title: 'Terminal', new: 'New terminal', loading: 'Reading terminal environment…', creating: 'Starting…',
  connecting: 'Connecting…', disconnected: 'Disconnected.', reconnect: 'Reconnect',
  readonly: 'This view is read-only.', control: 'Take control',
  closed: 'Terminal closed.', exited: 'Process exited ({code})', failed: 'Terminal error: {message}',
  rename: 'Terminal name', unavailable: 'Unavailable', retry: 'Retry',
  cleanupFailed: 'Terminal “{title}” could not be ended: {message}',
  missingTerminal: 'This terminal no longer exists. Open a new terminal.',
  inputFull: 'The input buffer is full. Reconnect and try again.',
  attachmentEnded: 'The terminal connection ended. Reconnect to continue.',
  invalidOutput: 'The terminal screen could not be received. Reconnect to recover it.',
  terminalLimit: 'The terminal limit has been reached. Close unused terminals and try again. Exited terminals also count toward the limit.',
} satisfies Record<keyof typeof ar, string>
