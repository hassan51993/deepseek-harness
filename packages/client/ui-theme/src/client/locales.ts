/** `settings.theme` namespace dictionaries (the Appearance and font-size rows' copy). */

/** Arabic dictionary (the key-set source of truth). */
export const ar = {
  'appearance.title': 'المظهر',
  'appearance.light': 'فاتح',
  'appearance.dark': 'داكن',
  'appearance.system': 'حسب النظام',
  'fontSize.title': 'حجم الخط',
  'fontSize.description': 'يؤثر في محتوى المحادثة فقط',
  'fontSize.unit': 'px',
  'fontSize.increase': 'تكبير حجم الخط',
  'fontSize.decrease': 'تصغير حجم الخط',
} satisfies Record<string, string>

/** The settings.theme namespace key union. */
export type ThemeKey = keyof typeof ar

/** English dictionary, checked complete against the ar key set. */
export const en = {
  'appearance.title': 'Appearance',
  'appearance.light': 'Light',
  'appearance.dark': 'Dark',
  'appearance.system': 'System',
  'fontSize.title': 'Font size',
  'fontSize.description': 'Only affects conversation content',
  'fontSize.unit': 'px',
  'fontSize.increase': 'Increase font size',
  'fontSize.decrease': 'Decrease font size',
} satisfies Record<ThemeKey, string>
