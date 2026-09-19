/** Markdown implementation labels and primitive chrome. */
export const ar = {
  'viewer.label': 'Markdown',
  'code.copy': 'نسخ',
  'code.copied': 'قد نسخ',
  'footnotes': 'قدم ملاحظة',
} satisfies Record<string, string>

/** Markdown namespace keys. */
export type MarkdownPreviewKey = keyof typeof ar

/** English labels, paired with the Arabic key set. */
export const en = {
  'viewer.label': 'Markdown',
  'code.copy': 'Copy',
  'code.copied': 'Copied',
  'footnotes': 'Footnotes',
} satisfies Record<MarkdownPreviewKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Markdown document renderer and its code/footnote controls. */
    documentMarkdown: MarkdownPreviewKey
  }
}
