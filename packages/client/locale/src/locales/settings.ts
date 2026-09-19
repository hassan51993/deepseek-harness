/** `settings.locale` namespace dictionaries (the Language row's copy). */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'language.title': 'اللغة',
} satisfies Record<string, string>

/** The settings.locale namespace key union. */
export type SettingsLocaleKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'language.title': 'Language',
} satisfies Record<SettingsLocaleKey, string>
