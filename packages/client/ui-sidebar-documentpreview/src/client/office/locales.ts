/** Office preview copy and Host render configuration guidance. */
export const ar = {
  title: 'مستند Office',
  loading: 'جارٍ القراءة…',
  retry: 'إعادة المحاولة',
  missingFonts: 'الخطوط المستخدمة في هذا المستند غير متاحة: {fonts}. قد يختلف النص والتنسيق.',
  showMore: 'عرض المزيد',
  dismissNotice: 'إخفاء تنبيه الخطوط',
  missingFontsTitle: 'خطوط ناقصة',
  missingFontsDescription: 'هذه الخطوط غير متاحة لهذه المعاينة. قد يختلف النص والتنسيق عن المستند الأصلي.',
  missingFontsCount: 'الخطوط: {count}',
  closeDetails: 'إغلاق تفاصيل الخطوط',
  unavailable: 'معاينة مستندات Office غير متاحة. فعّل خدمة معاينة المستندات على الجهاز الذي يشغّل DeepSeek Harness.',
  invalid: 'تعذّرت معاينة ملف Office هذا. قد يكون تالفًا أو محميًا بكلمة مرور أو بامتداد خاطئ.',
  tooLarge: 'حجم ملف Office أو ملف PDF الناتج يتجاوز حد المعاينة. صغّر الملف أو عدّل إعدادات المعاينة.',
  failed: 'لم يُنتج تحويل Office ملف PDF صالحًا للاستخدام. تحقّق من الملف وأعد المحاولة.',
  timeout: 'انتهت مهلة تحويل Office. أعد المحاولة.',
  busy: 'معاينة Office مشغولة. أعد المحاولة بعد قليل.',
  changed: 'تغيّر الملف أثناء قراءته. أعد فتح المعاينة.',
} satisfies Record<string, string>

/** Office preview locale keys. */
export type OfficePreviewKey = keyof typeof ar

/** English translations checked against the Arabic key set. */
export const en = {
  title: 'Office document',
  loading: 'Reading…',
  retry: 'Retry',
  missingFonts: 'Fonts used in this document are unavailable: {fonts}. Text and layout may differ.',
  showMore: 'Show more',
  dismissNotice: 'Dismiss font notice',
  missingFontsTitle: 'Missing fonts',
  missingFontsDescription: 'These fonts are unavailable for this preview. Text and layout may differ from the original document.',
  missingFontsCount: 'Fonts: {count}',
  closeDetails: 'Close font details',
  unavailable: 'Office previews are unavailable. Enable the document preview service on the computer running DeepSeek Harness.',
  invalid: 'This Office file cannot be previewed. It may be damaged, password protected, or have the wrong extension.',
  tooLarge: 'The Office file or converted PDF exceeds the preview size limit. Reduce the file size or adjust the preview configuration.',
  failed: 'Office conversion did not produce a usable PDF. Check the file and try again.',
  timeout: 'Office conversion timed out. Try again.',
  busy: 'Office preview is busy. Try again shortly.',
  changed: 'The file changed while being read. Reopen the preview.',
} satisfies Record<OfficePreviewKey, string>
