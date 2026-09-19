/**
 * `sidebarDocumentPreview` namespace dictionaries.
 *
 * The failure lines are the point of this file: a preview that cannot show a
 * page has to say which of several different things went wrong, and each one
 * suggests a different next step for the reader.
 */

/** Arabic dictionary and key-set source of truth. */
export const ar = {
  loading: 'صحيح في قراءة…',
  loadMore: 'تحميل أكثر كثير',
  changed: 'ملف قد تحديث، حالي عرض لـ قديم محتوى',
  reloadNow: 'إعادة تحميل دخول',
  reload: 'إعادة قراءة ملف',
  'wrap.enable': 'تلقائي تبديل سطر',
  'wrap.disable': 'إلغاء تبديل سطر',
  'wrap.aria': 'تلقائي تبديل سطر',
  openWith: 'فتح طريقة',
  'viewer.text': 'صاف نص',
  resourceUnavailable: 'ملف مورد خدمة غير ممكن استخدام',
  rendererUnavailable: 'معاينة جهاز {name} غير ممكن استخدام',
  unsupportedFile: 'هذا صيغة ملف مؤقت وقت لا يمكن معاينة',
  'error.notFound': 'ملف لا وجود، ممكن قد يتم نقل حركة أو حذف',
  'error.tooLarge': 'مفرد صفحة محتوى تجاوز مرور {limit} حد أعلى، لا يمكن قراءة',
  'error.notText': 'هذا صيغة ملف مؤقت وقت لا يمكن معاينة',
  'error.notRegularFile': 'هذا مسار لا هو عادي ملف، لا يوجد يمكن عرض محتوى',
  'error.unavailable': 'قراءة فشل:{message}',
  retry: 'إعادة محاولة',
} satisfies Record<string, string>

/** Text-preview dictionary key union. */
export type SidebarDocumentPreviewKey = keyof typeof ar

/** English dictionary, checked against the Arabic key set. */
export const en = {
  loading: 'Reading…',
  loadMore: 'Load more',
  changed: 'The file has changed, showing the previous content.',
  reloadNow: 'Reload',
  reload: 'Read the file again',
  'wrap.enable': 'Turn on line wrap',
  'wrap.disable': 'Turn off line wrap',
  'wrap.aria': 'Line wrap',
  openWith: 'Open with',
  'viewer.text': 'Plain text',
  resourceUnavailable: 'The file resource service is unavailable.',
  rendererUnavailable: 'The {name} preview is unavailable.',
  unsupportedFile: 'Preview is not available for this file type yet.',
  'error.notFound': 'File not found. It may have been moved or deleted.',
  'error.tooLarge': 'This page exceeds the {limit} limit and cannot be read.',
  'error.notText': 'Preview is not available for this file type yet.',
  'error.notRegularFile': 'Not a regular file, nothing to display.',
  'error.unavailable': 'Read failed: {message}',
  retry: 'Retry',
} satisfies Record<SidebarDocumentPreviewKey, string>
