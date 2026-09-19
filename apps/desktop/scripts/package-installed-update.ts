/** Operator-only signed packaging; default checks do not launch children, sign, install, or publish. */
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { InstalledUpdateSigningHoldError, packageInstalledUpdate } from './installed-update-packaging.ts'

async function main(): Promise<void> {
  const [manifest, version, mode, ...extra] = process.argv.slice(2)
  if (!manifest || !version || extra.length !== 0 || (mode !== undefined && mode !== '--check' && mode !== '--execute')) {
    throw new Error('invalid invocation')
  }
  const result = await packageInstalledUpdate(manifest, version, { execute: mode === '--execute',
    confirm: async (id, selectedVersion) => {
      if (!stdin.isTTY || !stdout.isTTY) return false
      const terminal = createInterface({ input: stdin, output: stdout })
      try {
        console.log('فقط في إدارة عضو قد مراجعة نواة و استعادة توقيع حفظ حماية بعد متابعة. تأكيد قد ملاحظة إلغاء أمر لوحة، باق بقية 5/5،PIN صحيح تأكيد كما بلا أخرى توقيع مهمة.')
        console.log('هذا مرة تحزيم سوف لديه كثير مرة توقيع؛ لا إعادة محاولة فشل عملية، قيادة داخلي إقرار إثبات مرة عدد لا يمكن حفظ إثبات. ظهور سري رمز نابض نافذة طلب إلغاء، لا يلزم تكملة نقل.')
        console.log('PIN فقط من .env.windows قراءة؛ توقيع واجهة اشتراط هو قصير مؤقت ظهور في SignTool معامل في. لن تثبيت أو فوق نقل.')
        const expected = `PACKAGE ${selectedVersion} ${id}`
        return (await terminal.question(`فقط تخويل هذا عدد إصدار، طلب إدخال ${expected}:`)) === expected
      } finally { terminal.close() }
    } })
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error: unknown) => {
  console.error(error instanceof InstalledUpdateSigningHoldError ? error.message
    : 'installed update packaging stopped. Check prepared files and the retained record; do not retry or remove protection automatically.')
  process.exitCode = 1
})
