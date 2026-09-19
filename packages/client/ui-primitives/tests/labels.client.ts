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
  code: { copyLabel: 'نسخ', copiedLabel: 'نسخ نجاح' },
  footnotes: 'Footnotes',
}

export const diffBlockLabels: DiffBlockLabels = {
  copy: 'نسخ', copied: 'نسخ نجاح', collapseAria: 'طي فرق مختلف',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر فرق مختلف`,
  collapse: 'طي', expand: hidden => `… ذلك بقية ${hidden} سطر`,
  files: count => `${count} ${count === 1 ? 'file' : 'files'}`,
}

export const readBlockLabels: ReadBlockLabels = {
  window: (shown, total) => `عرض ${shown} / ${total} سطر`,
  copy: 'نسخ', copied: 'نسخ نجاح', collapseAria: 'طي محتوى',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر`,
  collapse: 'طي', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const searchBlockLabels: SearchBlockLabels = {
  pathsSummary: (shown, total, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} عدد مسار`
    : `${shown} عدد مسار`,
  matchesSummary: (shown, total, files, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} موضع مطابقة · ${files} عدد ملف`
    : `${shown} موضع مطابقة · ${files} عدد ملف`,
  copy: 'نسخ', copied: 'نسخ نجاح', noResults: 'بلا نتيجة',
  collapseAria: 'طي نتيجة',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر نتيجة`,
  collapse: 'طي', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const terminalBlockLabels: TerminalBlockLabels = {
  signal: signal => `إشارة ${signal}`,
  exitCode: code => `خروج رمز ${code}`,
  noExitCode: 'لم صحيح معتاد خروج',
  running: 'تشغيل في', failed: 'فشل', done: 'اكتمل',
  copy: 'نسخ', copied: 'نسخ نجاح', noOutput: 'بلا إخراج',
  collapseAria: 'طي إخراج', collapse: 'طي',
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
  noResults: 'لم بحث إلى نتيجة', sourcesTruncated: 'مصدر قائمة قد مقتطع',
  http: 'HTTP', contentTruncated: 'محتوى قد مقتطع', markdown: markdownLabels,
}
