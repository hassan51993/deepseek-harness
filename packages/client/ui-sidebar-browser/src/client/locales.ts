/** Locale-owned Browser tab copy. */
export const ar = {
  'type.label': 'متصفح',
  'guide.title': 'متصفح',
  'guide.description': 'تصفّح صفحات HTTP(S)',
  'address.placeholder': 'أدخل عنوان HTTP(S)',
  'address.changed': 'تغيّر العنوان',
  back: 'رجوع',
  forward: 'تقدّم',
  reload: 'تحديث',
  go: 'انتقال',
  external: 'الفتح في متصفح النظام',
  'sandbox.disable': 'تعطيل قيود العزل',
  'sandbox.enable': 'استعادة قيود العزل',
  'sandbox.warning': 'قيود العزل معطّلة؛ يمكن للصفحة التنقّل بالتطبيق كاملًا واستخدام التنزيلات والنوافذ الحوارية وأقفال الإدخال.',
  start: 'أدخل عنوان HTTP(S) لبدء التصفّح',
  loading: 'جارٍ الفتح…',
  'error.empty': 'أدخل عنوانًا.',
  'error.invalid': 'هذا العنوان غير صالح أو طويل جدًا.',
  'error.protocol': 'عناوين HTTP وHTTPS فقط مدعومة؛ استخدم معاينة المستندات للملفات المحلية.',
  'error.credentials': 'لا يمكن أن يتضمّن العنوان اسم مستخدم أو كلمة مرور.',
  'error.application-origin': 'لا يمكن للمتصفح المضمَّن فتح تطبيق DSH نفسه.',
  'web.loadFailed': 'أبلغت الصفحة عن فشل في التحميل، أو قد تمنع التضمين؛ جرّب فتحها في متصفح النظام.',
  'web.unknown': 'انتقلت الصفحة داخل الإطار المضمَّن؛ لا يستطيع وضع الويب قراءة عنوانها الحالي.',
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
