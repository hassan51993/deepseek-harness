/** Office preview copy and Host render configuration guidance. */
export const ar = {
  title: 'Office وثيقة',
  loading: 'جارٍ قراءة…',
  retry: 'إعادة محاولة',
  missingFonts: 'نقص قليل وثيقة استخدام حرف جسم:{fonts}، ممكن أثر نص حرف و ترتيب إصدار.',
  showMore: 'عرض أكثر كثير',
  dismissNotice: 'إغلاق حرف جسم تلميح',
  missingFontsTitle: 'ناقص حرف جسم',
  missingFontsDescription: 'هذا مرة معاينة لا يمكن استخدام التالي حرف جسم، معاينة في نص حرف و ترتيب إصدار ممكن و أصل وثيقة مختلف.',
  missingFontsCount: '{count} نوع حرف جسم',
  closeDetails: 'إغلاق حرف جسم تفصيل حال',
  unavailable: 'Office معاينة غير ممكن استخدام. طلب في تشغيل DeepSeek Harness رئيسي آلة فوق تفعيل وثيقة معاينة خدمة.',
  invalid: 'لا يمكن معاينة هذا Office ملف. ملف ممكن قد ضرر تالف، تلقي سري رمز حفظ حماية، أو و توسيع اسم لا رمز.',
  tooLarge: 'Office ملف أو تحويل بعد PDF تجاوز مرور معاينة كبير صغير حد أعلى، طلب تقليص صغير ملف أو ضبط كامل معاينة إعداد.',
  failed: 'Office تحويل فشل، لم توليد متاح PDF. طلب فحص هذا ملف بعد إعادة محاولة.',
  timeout: 'Office تحويل مهلة، طلب إعادة محاولة.',
  busy: 'Office معاينة مهمة مقارنة كثير، طلب قليلا بعد إعادة محاولة.',
  changed: 'ملف في قراءة وقت قد أكثر تعديل، طلب إعادة فتح معاينة.',
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
