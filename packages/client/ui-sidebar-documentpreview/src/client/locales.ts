/**
 * `sidebarDocumentPreview` namespace dictionaries.
 *
 * The failure lines are the point of this file: a preview that cannot show a
 * page has to say which of several different things went wrong, and each one
 * suggests a different next step for the reader.
 */

/** Arabic dictionary and key-set source of truth. */
export const ar = {
  loading: 'جارٍ القراءة…',
  loadMore: 'تحميل المزيد',
  changed: 'تغيّر الملف، ويُعرض المحتوى السابق.',
  reloadNow: 'إعادة التحميل',
  reload: 'إعادة قراءة الملف',
  'wrap.enable': 'تفعيل التفاف الأسطر',
  'wrap.disable': 'إيقاف التفاف الأسطر',
  'wrap.aria': 'التفاف الأسطر',
  openWith: 'الفتح بواسطة',
  'viewer.text': 'نص عادي',
  resourceUnavailable: 'خدمة موارد الملفات غير متاحة.',
  rendererUnavailable: 'معاينة {name} غير متاحة.',
  unsupportedFile: 'المعاينة غير متاحة لهذا النوع من الملفات بعد.',
  'error.notFound': 'لم يُعثر على الملف. ربما نُقل أو حُذف.',
  'error.tooLarge': 'هذه الصفحة تتجاوز حد {limit} فلا يمكن قراءتها.',
  'error.notText': 'المعاينة غير متاحة لهذا النوع من الملفات بعد.',
  'error.notRegularFile': 'ليس ملفًا عاديًا، فلا يوجد ما يُعرض.',
  'error.unavailable': 'تعذّرت القراءة: {message}',
  retry: 'إعادة المحاولة',
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
