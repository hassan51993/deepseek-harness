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
  copy: 'نسخ', copied: 'نسخ نجاح', collapseAria: 'استلام بدء فرق مختلف',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر فرق مختلف`,
  collapse: 'استلام بدء', expand: hidden => `… ذلك بقية ${hidden} سطر`,
  files: count => `${count} ${count === 1 ? 'file' : 'files'}`,
}

export const readBlockLabels: ReadBlockLabels = {
  window: (shown, total) => `عرض ${shown} / ${total} سطر`,
  copy: 'نسخ', copied: 'نسخ نجاح', collapseAria: 'استلام بدء محتوى',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر`,
  collapse: 'استلام بدء', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const searchBlockLabels: SearchBlockLabels = {
  pathsSummary: (shown, total, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} عدد مسار`
    : `${shown} عدد مسار`,
  matchesSummary: (shown, total, files, truncated) => truncated
    ? `عرض ${shown} / مشترك ${total} موضع مطابقة · ${files} عدد ملف`
    : `${shown} موضع مطابقة · ${files} عدد ملف`,
  copy: 'نسخ', copied: 'نسخ نجاح', noResults: 'بلا نتيجة',
  collapseAria: 'استلام بدء نتيجة',
  expandAria: hidden => `توسيع ذلك بقية ${hidden} سطر نتيجة`,
  collapse: 'استلام بدء', expand: hidden => `… ذلك بقية ${hidden} سطر`,
}

export const terminalBlockLabels: TerminalBlockLabels = {
  signal: signal => `إشارة ${signal}`,
  exitCode: code => `خروج رمز ${code}`,
  noExitCode: 'لم صحيح معتاد خروج',
  running: 'تشغيل في', failed: 'فشل', done: 'قد إتمام',
  copy: 'نسخ', copied: 'نسخ نجاح', noOutput: 'بلا إخراج',
  collapseAria: 'استلام بدء إخراج', collapse: 'استلام بدء',
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
  noResults: 'لم بحث إلى نتيجة', sourcesTruncated: 'مصدر قائمة قد قطع قطع',
  http: 'HTTP', contentTruncated: 'محتوى قد قطع قطع', markdown: markdownLabels,
}
