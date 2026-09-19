/** Locale-owned Browser tab copy. */
export const ar = {
  'type.label': 'متصفح',
  'guide.title': 'متصفح',
  'guide.description': 'تصفح HTTP(S) شبكة صفحة',
  'address.placeholder': 'إدخال HTTP(S) عنوان',
  'address.changed': 'URL قد تغير',
  back: 'بعد تراجع',
  forward: 'قبل دخول',
  reload: 'تحديث جديد',
  go: 'قبل نحو',
  external: 'في نظام متصفح في فتح',
  'sandbox.disable': 'إغلاق صندوق رملي حد',
  'sandbox.enable': 'استعادة صندوق رملي حد',
  'sandbox.warning': 'صندوق رملي حد قد إغلاق؛ صفحة يمكن تنقل قمة طبقة تطبيق، و استخدام تحت تحميل، نموذج حالة محادثة إطار و إدخال قفل تحديد.',
  start: 'إدخال HTTP(S) عنوان بدء تصفح',
  loading: 'جارٍ فتح…',
  'error.empty': 'طلب إدخال عنوان.',
  'error.invalid': 'هذا عدد عنوان بلا فاعلية أو مرور طويل.',
  'error.protocol': 'فقط دعم حمل HTTP و HTTPS عنوان؛ محلي ملف طلب استخدام وثيقة معاينة.',
  'error.credentials': 'عنوان لا يستطيع يتضمن مستخدم اسم أو سري رمز.',
  'error.application-origin': 'لا يستطيع في تضمين دخول متصفح في فتح DSH تطبيق ذاته.',
  'web.loadFailed': 'صفحة تقرير إبلاغ تحميل فشل أو ممكن منع توقف تضمين دخول؛ يمكن محاولة تجربة في نظام متصفح في فتح.',
  'web.unknown': 'صفحة قد في iframe داخل قفز تحويل؛Web نمط لا يمكن قراءة حالي URL.',
} satisfies Record<string, string>

/** Browser dictionary key union. */
export type SidebarBrowserKey = keyof typeof ar

/** English dictionary with the same keys. */
export const en = {
  'type.label': 'Browser',
  'guide.title': 'Browser',
  'guide.description': 'Browse HTTP(S) pages',
  'address.placeholder': 'Enter an HTTP(S) address',
  'address.changed': 'URL changed',
  back: 'Back',
  forward: 'Forward',
  reload: 'Reload',
  go: 'Go',
  external: 'Open in system browser',
  'sandbox.disable': 'Disable sandbox restrictions',
  'sandbox.enable': 'Restore sandbox restrictions',
  'sandbox.warning': 'Sandbox restrictions are disabled; the page can navigate the top-level app and use downloads, modal dialogs, and input locks.',
  start: 'Enter an HTTP(S) address to start browsing',
  loading: 'Opening…',
  'error.empty': 'Enter an address.',
  'error.invalid': 'That address is invalid or too long.',
  'error.protocol': 'Only HTTP and HTTPS addresses are supported; use Document Preview for local files.',
  'error.credentials': 'Addresses cannot contain a username or password.',
  'error.application-origin': 'The embedded browser cannot open the DSH application itself.',
  'web.loadFailed': 'The page reported a load failure or may block embedding; try opening it in the system browser.',
  'web.unknown': 'The page navigated inside the iframe; Web mode cannot read its current URL.',
} satisfies Record<SidebarBrowserKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Sidebar Browser labels, navigation controls, and failures. */
    sidebarBrowser: SidebarBrowserKey
  }
}
