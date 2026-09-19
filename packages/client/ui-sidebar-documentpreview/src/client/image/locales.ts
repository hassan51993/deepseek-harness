/** Locale-owned image renderer labels and status text. */
export const zh = {
  title: 'صورة',
  preview: 'صورة معاينة:{name}',
  loading: 'صحيح في قراءة…',
  failed: 'لا يمكن عرض هذا ورقة صورة',
  unsupported: 'صورة معاينة حاجة كامل ملف محتوى',
} satisfies Record<string, string>

/** Image renderer dictionary keys. */
export type ImagePreviewKey = keyof typeof zh

/** English dictionary with the same keys as the Chinese dictionary. */
export const en = {
  title: 'Image',
  preview: 'Image preview: {name}',
  loading: 'Reading…',
  failed: 'This image could not be displayed.',
  unsupported: 'Image preview requires the complete file contents.',
} satisfies Record<ImagePreviewKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Image preview selection, accessible name, and status text. */
    sidebarImage: ImagePreviewKey
  }
}
