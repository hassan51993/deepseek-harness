/**
 * `sidebarFiles` namespace dictionaries, and the namespace's declaration.
 *
 * The failure lines name what the tree could not list, one code each, because a
 * directory that is gone, one outside the workspace, and a path that is not a
 * directory each suggest a different next step.
 *
 * The namespace merge lives with its key set so that any module naming
 * `TranslateNS<'sidebarFiles'>` or `PropsLocale<'sidebarFiles'>` needs only this
 * file, whichever entry a program loads first.
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** File-tree type name, guide entry, row states, and failure lines. */
    sidebarFiles: SidebarFilesKey
  }
}

/** Simplified Chinese dictionary and key-set source of truth. */
export const zh = {
  'type.label': 'ملف',
  'guide.title': 'مساحة العمل ملف',
  'guide.description': 'تصفح تصفح جلسة مساحة العمل ملف',
  loading: 'صحيح في قراءة…',
  empty: 'فارغ دليل',
  truncated: 'بند جدا كثير، فقط عرض واحد جزء.',
  noWorkspace: 'هذا عدد جلسة لا يوجد مساحة العمل دليل.',
  reload: 'إعادة قراءة',
  'entry.other': 'هذا لا هو ملف أو دليل، لا قاعدة فتح.',
  'error.notFound': 'هذا عدد دليل لا في. ممكن قد يتم نقل حركة أو حذف.',
  'error.outsideWorkspace': 'هذا عدد دليل في مساحة العمل خارج، جانب شريط لن قراءة هو.',
  'error.notDirectory': 'هذا لا هو واحد دليل.',
  'error.unavailable': 'قراءة فشل:{message}',
} satisfies Record<string, string>

/** Files dictionary key union. */
export type SidebarFilesKey = keyof typeof zh

/** English dictionary, checked against the Chinese key set. */
export const en = {
  'type.label': 'Files',
  'guide.title': 'Workspace files',
  'guide.description': 'Browse files in this session\'s workspace',
  loading: 'Reading…',
  empty: 'Empty directory',
  truncated: 'Too many entries, showing only some of them.',
  noWorkspace: 'This session has no workspace directory.',
  reload: 'Reload',
  'entry.other': 'Not a file or a directory, so it cannot be opened.',
  'error.notFound': 'That directory is gone. It may have been moved or deleted.',
  'error.outsideWorkspace': 'That directory is outside the workspace, so the sidebar will not read it.',
  'error.notDirectory': 'That is not a directory.',
  'error.unavailable': 'Read failed: {message}',
} satisfies Record<SidebarFilesKey, string>
