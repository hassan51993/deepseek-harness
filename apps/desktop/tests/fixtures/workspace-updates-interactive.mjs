/** Operator-controlled qualification using the real workspace; synthetic payloads never execute. */
import { app, BrowserWindow, Menu, dialog } from 'electron'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Keep the private workspace open until the operator closes the control window or exits the application.
 * @param {object} options Real workspace and fixture-owned delivery, task, and installation controls.
 * @returns {Promise<void>} Resolves after operator exit and removal of control listeners.
 */
export async function runInteractiveUpdates({ mainWindow, server, fixture, checkMenu, control, root }) {
  const panel = new BrowserWindow({ title: 'محلي ترقية تحقق استلام تحكم', width: 640, height: 460,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } })
  const finished = Promise.withResolvers()
  const finish = () => finished.resolve()
  panel.once('closed', finish)
  app.once('before-quit', finish)
  let closing = false
  const originalInstall = fixture.updater.quitAndInstall
  fixture.updater.quitAndInstall = (...args) => {
    fixture.installations.push(args)
    void dialog.showMessageBox(panel, { type: 'info', title: 'محلي تحقق استلام انتهاء',
      message: 'قد إتمام تحت تحميل، تحقق، تثبيت تأكيد و مهمة استلام ذيل.',
      detail: 'تثبيت جهاز استدعاء قد اعتراض قطع، لم تثبيت أو إعادة بدء إلى جديد إصدار. تأكيد بعد خروج هذا جولة عرض تدريب؛ إعادة تشغيل أمر يمكن بدء تحت واحد جولة.',
      buttons: ['انتهاء عرض تدريب'] }).then(finish).catch(finish)
  }
  const action = (label, operation) => ({ label, click: () => {
    if (closing) return
    void Promise.resolve().then(operation).catch(error => {
      console.error(error)
      if (!panel.isDestroyed()) dialog.showErrorBox('محلي تحقق استلام عملية فشل', String(error))
    })
  } })
  const select = mode => server.select(mode, '0.1.6-nightly.1')
  select('hold-download')
  const check = () => checkMenu.click()
  panel.setMenu(Menu.buildFromTemplate([
    { label: 'تحديث مشهد', submenu: [
      action('عادي تحديث (نقر تحت تحميل بعد إبقاء دخول درجة)', () => { server.policy('clear'); select('hold-download'); check() }),
      action('قوي صنع تحديث (نقر تحت تحميل بعد إبقاء دخول درجة)', () => { server.policy('force'); select('hold-download'); check() }),
      action('وضع سطر حالي تحت تحميل → تحقق و تثبيت تأكيد', () => server.release()),
      { type: 'separator' },
      action('تحت مرة تحت تحميل: تحقق فشل', () => select('corrupt')),
      action('تحت مرة تحت تحميل:404 فشل', () => select('download-404')),
      action('تحت مرة تحت تحميل: استعادة صحيح معتاد', () => select('healthy')),
      action('فحص فشل', () => { select('feed-404'); check() }),
      action('لا يوجد متاح تحديث (لم تحت تحميل قبل استخدام)', () => { server.select('healthy', '0.1.5-rc.1'); check() }),
      action('حل حذف قوي أكثر منع سد', () => { server.policy('clear'); check() }),
    ] },
    { label: 'مهمة حالة', submenu: [
      action('إضافة ترتيب طابور مهمة', () => control('queue')),
      action('صاف فارغ ترتيب طابور مهمة', () => control('clear')),
      action('نموذج محاكاة مهمة إيقاف فشل (هذا جولة صالح)', () => control('hold-shutdown')),
    ] },
    { label: 'نافذة', submenu: [
      action('إرجاع تطبيق', () => { mainWindow.restore(); mainWindow.show(); mainWindow.focus() }),
      action('انتهاء عرض تدريب', finish),
    ] },
  ]))
  try {
    await panel.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html><html lang="ar-SA">
      <meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
      <style>body{font:16px/1.8 system-ui;padding:24px;color:#222}h2{margin-top:0}strong{color:#165dff}</style>
      <h2>يد حركة ترقية تحقق استلام · لا تنفيذ تثبيت جهاز</h2>
      <p>استخدام هذا نافذة قمة جزء<strong>تحديث مشهد</strong>قائمة مفرد اختيار عادي تحديث أو قوي صنع تحديث، مجددا إلى تطبيق داخل نقر تحت تحميل.</p>
      <p>تحت تحميل سوف إبقاء دخول درجة، توفير أنت فحص نظر. عودة إلى هذا داخل اختيار<strong>وضع سطر حالي تحت تحميل</strong>، عندئذ سوف دخول تحقق و تثبيت تأكيد.</p>
      <p>استخدام<strong>مهمة حالة</strong>قائمة مفرد إضافة ترتيب طابور مهمة، فحص نظر تثبيت قبل مهمة تحذير إبلاغ. فشل نمط يجب في تحت تحميل قبل اختيار.</p>
      <p>بيانات و تحديث خادم متساو لـ محلي عزل اختبار. تحت تحميل عنوان لـ عرض مثال عنوان. إغلاق هذا نافذة انتهاء عرض تدريب؛ إعادة ركض أمر إعادة وضع حالة.</p>
      </html>`)}`)
    console.log(`Interactive updater ready: ${root}`)
    await finished.promise
    closing = true
    await writeFile(join(root, 'interactive-result.json'), JSON.stringify({ installerExecuted: false,
      interceptedInstallations: fixture.installations.length, phases: fixture.states.map(state => state.phase) }, null, 2) + '\n')
  } finally {
    closing = true
    fixture.updater.quitAndInstall = originalInstall
    app.off('before-quit', finish)
    panel.off('closed', finish)
    if (!panel.isDestroyed()) panel.destroy()
  }
}
