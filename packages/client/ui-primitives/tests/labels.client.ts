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
  footnotes: 'Footnotes',
}

export const diffBlockLabels: DiffBlockLabels = {
  copy: 'نسخ', copied: 'تم النسخ', collapseAria: 'طي الفروق',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر فرق مختلف`,
  collapse: 'عرض أقل', expand: hidden => `… ذلك بقية ${hidden} سطر`,
  files: count => `${count} ${count === 1 ? 'file' : 'files'}`,
}

export const readBlockLabels: ReadBlockLabels = {
  window: (shown, total) => `عرض ${shown} / ${total} سطر`,
  copy: 'نسخ', copied: 'تم النسخ', collapseAria: 'طي المحتوى',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر`,
  collapse: 'عرض أقل', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const searchBlockLabels: SearchBlockLabels = {
  pathsSummary: (shown, total, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} عدد مسار`
    : `${shown} عدد مسار`,
  matchesSummary: (shown, total, files, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} موضع مطابقة · ${files} عدد ملف`
    : `${shown} موضع مطابقة · ${files} عدد ملف`,
  copy: 'نسخ', copied: 'تم النسخ', noResults: 'لا توجد نتائج',
  collapseAria: 'طي النتائج',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر نتيجة`,
  collapse: 'عرض أقل', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const terminalBlockLabels: TerminalBlockLabels = {
  signal: signal => `إشارة ${signal}`,
  exitCode: code => `رمز الخروج ${code}`,
  noExitCode: 'بلا رمز خروج',
  running: 'قيد التشغيل', failed: 'فشل', done: 'اكتمل',
  copy: 'نسخ', copied: 'تم النسخ', noOutput: 'لا يوجد إخراج',
  collapseAria: 'طي الإخراج', collapse: 'عرض أقل',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر إخراج`,
  expand: hidden => `… ذلك بقية ${hidden} سطر`,
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
