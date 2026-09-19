/** Copy owned by the sidebar terminal feature. */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    sidebarTerminal: keyof typeof ar
  }
}

/** Arabic terminal copy. */
export const ar = {
  recoveryFailed: 'تعذّرت استعادة الطرفية: {message}', retryRecovery: 'إعادة محاولة استعادة الطرفية',
  shell: 'اختيار Shell', shellLoading: 'جارٍ تحميل قائمة Shell…', shellEmpty: 'لا يوجد Shell متاح', description: 'تشغيل الأوامر في مساحة عمل الجلسة',
  title: 'الطرفية', new: 'طرفية جديدة', loading: 'جارٍ قراءة بيئة الطرفية…', creating: 'جارٍ البدء…',
  connecting: 'جارٍ الاتصال…', disconnected: 'انقطع الاتصال.', reconnect: 'إعادة الاتصال',
  readonly: 'هذا العرض للقراءة فقط.', control: 'تولّي التحكّم',
  closed: 'أُغلقت الطرفية.', exited: 'انتهت العملية ({code})', failed: 'خطأ في الطرفية: {message}',
  rename: 'اسم الطرفية', unavailable: 'غير متاح', retry: 'إعادة المحاولة',
  cleanupFailed: 'تعذّر إنهاء الطرفية «{title}»: {message}',
  missingTerminal: 'لم تعد هذه الطرفية موجودة. افتح طرفية جديدة.',
  inputFull: 'ذاكرة الإدخال ممتلئة. أعِد الاتصال ثم حاول مجددًا.',
  attachmentEnded: 'انتهى اتصال الطرفية. أعِد الاتصال للمتابعة.',
  invalidOutput: 'تعذّر استقبال شاشة الطرفية. أعِد الاتصال لاستعادتها.',
  terminalLimit: 'بلغ عدد الطرفيات الحد الأقصى. أغلِق الطرفيات غير المستخدمة ثم حاول مجددًا. الطرفيات المنتهية تُحتسب ضمن الحد أيضًا.',
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
