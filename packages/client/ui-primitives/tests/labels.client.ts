import type {
  DiffBlockLabels,
  JsonTreeLabels,
  MarkdownLabels,
  ReadBlockLabels,
  SearchBlockLabels,
  TerminalBlockLabels,
  WebBlockLabels,
} from '../src/index.ts'

export const markdownLabels: MarkdownLabels = {
  code: { copyLabel: 'نسخ', copiedLabel: 'تم النسخ' },
  footnotes: 'الحواشي',
}

export const diffBlockLabels: DiffBlockLabels = {
  copy: 'نسخ', copied: 'تم النسخ', collapseAria: 'طي الفروق',
  expandAria: hidden => `توسيع ${hidden} سطر فروق إضافي`,
  collapse: 'عرض أقل', expand: hidden => `… ${hidden} سطر إضافي`,
  files: count => `${count} ${count === 1 ? 'file' : 'files'}`,
}

export const readBlockLabels: ReadBlockLabels = {
  window: (shown, total) => `عرض ${shown} من ${total} سطر`,
  copy: 'نسخ', copied: 'تم النسخ', collapseAria: 'طي المحتوى',
  expandAria: hidden => `توسيع ${hidden} سطر إضافي`,
  collapse: 'عرض أقل', expand: hidden => `… ${hidden} سطر إضافي`,
}

export const searchBlockLabels: SearchBlockLabels = {
  pathsSummary: (shown, total, truncated) => truncated
    ? `عرض ${shown} من ${total} مسار`
    : `${shown} مسار`,
  matchesSummary: (shown, total, files, truncated) => truncated
    ? `عرض ${shown} من ${total} مطابقة · ${files} ملف`
    : `${shown} مطابقة · ${files} ملف`,
  copy: 'نسخ', copied: 'تم النسخ', noResults: 'لا توجد نتائج',
  collapseAria: 'طي النتائج',
  expandAria: hidden => `توسيع ${hidden} سطر نتائج إضافي`,
  collapse: 'عرض أقل', expand: hidden => `… ${hidden} سطر إضافي`,
}

export const terminalBlockLabels: TerminalBlockLabels = {
  signal: signal => `إشارة ${signal}`,
  exitCode: code => `رمز الخروج ${code}`,
  noExitCode: 'بلا رمز خروج',
  running: 'قيد التشغيل', failed: 'فشل', done: 'تم',
  copy: 'نسخ', copied: 'تم النسخ', noOutput: 'لا يوجد إخراج',
  collapseAria: 'طي الإخراج', collapse: 'عرض أقل',
  expandAria: hidden => `توسيع أسطر الإخراج المتبقية (${hidden})`,
  expand: hidden => `… ${hidden} سطر إضافي`,
}

export const jsonTreeLabels: JsonTreeLabels = {
  copyValue: 'Copy value', copyJson: 'Copy JSON', copyPath: 'Copy property path',
  copyPrettyJson: 'Copy pretty JSON', copyCompactJson: 'Copy compact JSON',
  copied: 'Copied', copyFailed: 'Copy failed',
  collapseNode: 'Collapse JSON node', expandNode: 'Expand JSON node',
  copyButtonTitle: action => `${action}; right-click for copy options`,
}

export const webBlockLabels: WebBlockLabels = {
  noResults: 'لم يُعثر على نتائج', sourcesTruncated: 'اقتُطعت قائمة المصادر',
  http: 'HTTP', contentTruncated: 'اقتُطع المحتوى', markdown: markdownLabels,
}
