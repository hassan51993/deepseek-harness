/** Operator entry for separate test binary uploads and fixed-feed publication; default mode is local-only. */
import { parseArgs } from 'node:util'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { verifiedInstalledUpdateDistribution, executeInstalledUpdatePublication } from './installed-update-publication.ts'
import { createInstalledUpdateCos } from './installed-update-cos.ts'

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    execute: { type: 'boolean', default: false }, journals: { type: 'string' },
  } })
  const [action, manifest, version, receipt, ...extra] = positionals
  if ((action !== 'upload-binaries' && action !== 'publish-feed') || !manifest || !version || !receipt || extra.length) {
    throw new Error('invalid invocation')
  }
  const prepared = await verifiedInstalledUpdateDistribution(manifest, version, receipt)
  console.log(JSON.stringify({ action, version, runId: prepared.run.id, destination: prepared.distribution,
    mode: values.execute ? 'awaiting-operator' : 'local-check', networkStarted: false }, null, 2))
  if (!values.execute) return
  if (!stdin.isTTY || !stdout.isTTY) throw new Error('operator terminal required')
  const expected = `${action === 'upload-binaries' ? 'UPLOAD' : 'PUBLISH'} ${version} ${prepared.run.id}`
  const terminal = createInterface({ input: stdin, output: stdout })
  let confirmed = false
  try {
    console.log(action === 'upload-binaries'
      ? 'فقط تخويل هذا دفعة مرة test اثنان دخول صنع فوق نقل. تأكيد لا يوجد أخرى إصدار من؛ سوف كامل عودة قراءة تثبيت حزمة، ممكن إنتاج مقارنة كبير تحت تحميل تدفق كمية.'
      : 'فقط تخويل هذا دفعة مرة test بيان إصدار. تأكيد لا يوجد أخرى إصدار من؛ إعادة استخدام نجاح فوق نقل عودة تنفيذ، فقط عودة قراءة بيان، لا تكرار تحت تحميل تثبيت حزمة.')
    if (action === 'publish-feed' && version === prepared.run.versions[1]) {
      console.log('تأكيد إصدار 1 قد عبر تثبيت بعد مدخل بدء و ما زال في تشغيل؛ يجب توفير هذا دفعة مرة journals دليل.')
    }
    confirmed = (await terminal.question(`طلب إدخال ${expected}:`)) === expected
  } finally { terminal.close() }
  if (!confirmed) throw new Error('operator declined')
  console.log(await executeInstalledUpdatePublication(manifest, version, receipt, action, createInstalledUpdateCos(), values.journals))
}

main().catch(() => {
  console.error('installed update: upload/publication stopped. Review local prerequisites and any retained operation record; no automatic retry.')
  process.exitCode = 1
})
