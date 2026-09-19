/**
 * `sidebarRight` namespace dictionaries.
 *
 * Everything a user reads in this column is here, including the strings handed
 * to the docking kit — the kit renders no copy of its own, so its whole
 * vocabulary is this package's to own and translate.
 */

/** Arabic dictionary and key-set source of truth. */
export const ar = {
  'chrome.expand': 'فتح جانب حافة شريط',
  'chrome.expandAria': 'فتح يمين جانب حافة شريط',
  'chrome.collapse': 'استلام بدء جانب حافة شريط',
  'chrome.collapseAria': 'استلام بدء يمين جانب حافة شريط',
  'chrome.toFullscreen': 'كل شاشة',
  'chrome.exitFullscreen': 'خروج كل شاشة',
  'dock.emptyPane': 'فارغ وجه لوح',
  'dock.splitPane': 'قسم شريط',
  'dock.splitPaneDisabled': 'قد بلوغ اثنان إطار حد أعلى',
  'dock.splitPaneNarrow': 'شريط عرض لا كاف، سحب عرض جانب حافة شريط بعد مجددا قسم شريط',
  'dock.closeTab': 'إغلاق',
  'dock.addTab': 'جديد وسم صفحة',
  'dock.dockFloat': 'استلام عودة إلى جانب حافة شريط',
  'dock.closeFloat': 'إغلاق',
  'dock.drop.center': 'نقل إلى هذا داخل',
  'dock.drop.left': 'يسار قسم شريط',
  'dock.drop.right': 'يمين قسم شريط',
  'dock.drop.top': 'فوق قسم شريط',
  'dock.drop.bottom': 'تحت قسم شريط',
  'tab.guide.title': 'بدء',
  'tab.unavailable': 'هذا صنف محتوى أيضا لا يوجد متاح فحص نظر طريقة.',
} satisfies Record<string, string>

/** Right-Sidebar dictionary key union. */
export type SidebarRightKey = keyof typeof ar

/** English dictionary, checked against the Arabic key set. */
export const en = {
  'chrome.expand': 'Open sidebar',
  'chrome.expandAria': 'Open right sidebar',
  'chrome.collapse': 'Collapse sidebar',
  'chrome.collapseAria': 'Collapse right sidebar',
  'chrome.toFullscreen': 'Fullscreen',
  'chrome.exitFullscreen': 'Exit fullscreen',
  'dock.emptyPane': 'Empty pane',
  'dock.splitPane': 'Split',
  'dock.splitPaneDisabled': 'Two panes is the limit',
  'dock.splitPaneNarrow': 'Not enough width to split, widen the sidebar',
  'dock.closeTab': 'Close',
  'dock.addTab': 'New tab',
  'dock.dockFloat': 'Send back to the sidebar',
  'dock.closeFloat': 'Close',
  'dock.drop.center': 'Move here',
  'dock.drop.left': 'Add left split',
  'dock.drop.right': 'Add right split',
  'dock.drop.top': 'Add top split',
  'dock.drop.bottom': 'Add bottom split',
  'tab.guide.title': 'Start',
  'tab.unavailable': 'Nothing here can view this kind of content yet.',
} satisfies Record<SidebarRightKey, string>
