/** `reference` namespace dictionaries for the unified `@` source. */

import type {} from '@deepseek-ai/dsh-client-ui-slots'

/** Dictionary namespace owned by this plugin. */
export const NS = 'reference'

/**
 * Arabic dictionary (the key-set source of truth).
 *
 * The `time.*` bucket words are this namespace's own copy of the session-row
 * vocabulary: locale-owned copy keeps the words per plugin, while the
 * bucketing they name is the one shared {@link relativeTime} in ui-primitives.
 */
export const ar = {
  'section.files': 'ملف و ملف مشبك',
  'section.subagents': 'فرعي ذكي جسم',
  'section.sessions': 'محادثة',
  'candidate.noCwd': '(بلا عمل دليل)',
  'crumb.root': 'مساحة العمل',
  'time.now': 'للتو',
  'time.minutes': '{n}دقيقة',
  'time.hours': '{n}ساعة',
  'time.days': '{n}يوم',
  'time.months': '{n}عدد شهر',
  'time.years': '{n}سنة',
} satisfies Record<string, string>

/** The reference namespace key union. */
export type ReferenceKey = keyof typeof ar

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The unified `@` reference menu's copy. */
    reference: ReferenceKey
  }
}

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'section.files': 'Files & folders',
  'section.subagents': 'Subagents',
  'section.sessions': 'Sessions',
  'candidate.noCwd': '(no cwd)',
  'crumb.root': 'Workspace',
  'time.now': 'now',
  'time.minutes': '{n}min',
  'time.hours': '{n}h',
  'time.days': '{n}d',
  'time.months': '{n}mo',
  'time.years': '{n}y',
} satisfies Record<ReferenceKey, string>
