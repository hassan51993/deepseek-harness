// Web e2e scenario: the configuration pages on the Plugins page — the official
// pages a deployment's exposed host-plane namespaces produce, one field edited
// through the real wire down to `$DSH_HOME/settings.yaml`, the override badge
// and reset that layering produces, and a community bundle's row configuration
// registered by its own browser half. Zero model calls: everything is client
// state plus the settings document and the profile on a blank frame, so there
// is no fixture and a stray stream would fail loud on the open llm seam.
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Browser, Locator, Page } from 'playwright'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, it, onTestFailed } from 'vitest'
import { join } from 'node:path'
import {
  assertFixtureInventory, captureStableAria, compareOrRefreshGolden,
  launchWebScaffold, watchConsole, webSnapshotMode, type WebScaffold,
} from './scaffold.ts'
import { AR_BROWSER_LOCALE, saveFailureShot } from './support.ts'

const SNAPSHOT_DIR = fileURLToPath(new URL('./expected/plugin-config', import.meta.url))
const OFFICIAL_EXPECTED = join(SNAPSHOT_DIR, 'official.expected.md')
const ROW_EXPECTED = join(SNAPSHOT_DIR, 'row.expected.md')
const FIXTURE_PLUGINS = fileURLToPath(new URL('./fixtures/plugins', import.meta.url))
const MODE = webSnapshotMode()

describe('web e2e: plugin configuration pages', () => {
  let scaffold: WebScaffold
  let browser: Browser
  let page: Page
  let tripwire: ReturnType<typeof watchConsole>

  beforeAll(async () => {
    // The live-client fixture is a bundle with a browser half; switched on
    // below, that half registers its row's configuration into the page.
    scaffold = await launchWebScaffold({
      profile: { packages: [{ dir: join(FIXTURE_PLUGINS, 'fixture-live-client') }] },
    })
    browser = await chromium.launch()
    // Arabic browser: the pages assert the localized copy the client derives
    // from it, as the rest of the settings surface does.
    page = await browser.newPage({ viewport: { width: 1680, height: 1000 }, locale: AR_BROWSER_LOCALE })
    tripwire = watchConsole(page)
    await page.goto(scaffold.authenticatedUrl, { waitUntil: 'load' })
    await page.waitForSelector('[class*="frame"]', { timeout: 30_000 })
  }, 120_000)

  afterAll(async () => {
    await browser?.close()
    await scaffold?.close()
  })

  /**
   * Show the Plugins page's cards. The scenarios share one page so the
   * settings document accumulates across them, so this closes any settings
   * dialog a previous scenario left open and leaves whatever page it opened.
   */
  async function openPlugins(): Promise<Locator> {
    if (await page.getByRole('dialog', { name: 'ضبط' }).count() > 0) {
      await page.keyboard.press('Escape')
      await expect.poll(() => page.getByRole('dialog', { name: 'ضبط' }).count(), { timeout: 5_000 }).toBe(0)
    }
    await page.getByRole('navigation', { name: 'اللوحات العامة' }).getByRole('button', { name: 'إضافة', exact: true }).click()
    const panel = page.locator('[data-plugin-panel]')
    await panel.waitFor({ timeout: 10_000 })
    while (await panel.getByRole('button', { name: /^إرجاع/ }).count() > 0) {
      await panel.getByRole('button', { name: /^إرجاع/ }).first().click()
    }
    await panel.getByRole('heading', { name: 'رسمية', exact: true }).waitFor({ timeout: 20_000 })
    return panel
  }

  /** Open one official plugin's page from its card and wait for its form. */
  async function openPage(panel: Locator, title: string): Promise<void> {
    await panel.getByRole('button', { name: `عرض ${title}`, exact: true }).click()
    await panel.locator('[data-plugin-config]').waitFor({ timeout: 10_000 })
  }

  /** The settings document as the Host has written it so far. */
  async function settingsDocument(): Promise<string> {
    return readFile(join(scaffold.harnessHome, 'settings.yaml'), 'utf8').catch(() => '')
  }

  it('lists one official page per exposed host-plane namespace after the official bundles', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-cards'))
    const panel = await openPlugins()

    // Every page the shipped web composition exposes: the shell executor, the
    // agent loop, subagent selection, and the DeepSeek search provider, after
    // the two official bundles the installation ships switched off.
    await panel.getByRole('button', { name: 'عرض بحث في الويب', exact: true }).waitFor({ timeout: 20_000 })
    const official = panel.locator('[data-plugin-group="official"]')
    expect(await official.locator('[data-plugin-package]').count()).toBe(2)
    expect(await official.locator('[data-plugin-item]').count()).toBe(4)
    for (const title of ['طرفية', 'حلقة الوكيل', 'Subagent', 'بحث في الويب']) {
      expect(await official.getByRole('button', { name: `عرض ${title}`, exact: true }).count()).toBe(1)
    }
    // A card carries the one-liner; the fields wait for the page.
    expect(await official.getByText('يحدّ كل أمر يشغّله الوكيل.', { exact: true }).count()).toBe(1)
    expect(await panel.getByLabel('أمر مهلة (مللي ث)').count()).toBe(0)

    const snapshot = await captureStableAria(page, '[data-plugin-panel]', scaffold.workspaceCwd)
    await compareOrRefreshGolden(OFFICIAL_EXPECTED, snapshot, MODE)
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('saves subagent limits and resets them to the deployment defaults', async () => {
    const panel = await openPlugins()
    await openPage(panel, 'Subagent')
    const depth = panel.getByLabel('أقصى عمق للتداخل', { exact: true })
    const capacity = panel.getByLabel('حد التوازي للوكلاء الفرعيين', { exact: true })
    expect(await depth.inputValue()).toBe('1')
    expect(await capacity.inputValue()).toBe('8')
    await depth.fill('2')
    await capacity.fill('12')
    await panel.getByRole('button', { name: 'حفظ', exact: true }).click()
    await expect.poll(() => panel.getByRole('button', { name: 'حفظ', exact: true }).isDisabled()).toBe(true)
    await expect.poll(settingsDocument).toContain('maxActiveSubagents: 12')
    await expect.poll(settingsDocument).toContain('maxDepth: 2')
    await openPlugins()
    await openPage(panel, 'Subagent')
    const snapshot = await captureStableAria(page, '[data-plugin-panel]', scaffold.workspaceCwd)
    await compareOrRefreshGolden(join(SNAPSHOT_DIR, 'subagent.expected.md'), snapshot, MODE)
    const controlHeight = await depth.evaluate(element => element.getBoundingClientRect().height)
    await depth.fill('1.5')
    expect(await depth.evaluate(element => element.getBoundingClientRect().height)).toBe(controlHeight)
    expect(await panel.getByRole('button', { name: 'حفظ', exact: true }).isDisabled()).toBe(true)
    await depth.fill('2')
    await panel.getByRole('button', { name: 'إعادة التعيين إلى الافتراضي', exact: true }).first().click()
    await panel.getByRole('button', { name: 'إعادة التعيين إلى الافتراضي', exact: true }).first().click()
    await panel.getByRole('button', { name: 'حفظ', exact: true }).click()
    await expect.poll(() => panel.getByRole('button', { name: 'حفظ', exact: true }).isDisabled()).toBe(true)
    await openPlugins()
    await openPage(panel, 'Subagent')
    expect(await depth.inputValue()).toBe('1')
    expect(await capacity.inputValue()).toBe('8')
    await panel.getByRole('button', { name: 'العودة إلى الإضافات', exact: true }).click()
  })

  it('opens field explanations with the keyboard and retains unsaved edits', async () => {
    const panel = await openPlugins()
    await openPage(panel, 'Subagent')
    const depth = panel.getByLabel('أقصى عمق للتداخل', { exact: true })
    await depth.fill('2')
    const depthHelp = panel.getByRole('button', { name: 'عن أقصى عمق للتداخل', exact: true })
    expect(await panel.getByRole('region', { name: 'عن أقصى عمق للتداخل', exact: true }).count()).toBe(0)
    await depthHelp.press('Enter')
    const depthRules = panel.getByRole('region', { name: 'عن أقصى عمق للتداخل', exact: true })
    await depthRules.waitFor()
    expect(await depthRules.getByText('يحدّ عدد المستويات التي يمكن للوكيل أن ينشئ فيها وكلاء فرعيين.', { exact: true }).count()).toBe(1)
    const depthTable = depthRules.getByRole('table', { name: 'عن أقصى عمق للتداخل', exact: true })
    expect(await depthTable.getByRole('row', { name: '0 تعطيل الوكلاء الفرعيين', exact: true }).count()).toBe(1)
    expect(await depthTable.getByRole('row', { name: '1 الوكيل الرئيسي وحده ينشئ وكلاء فرعيين', exact: true }).count()).toBe(1)
    expect(await depthRules.getByText('إذا حدّدت أداةٌ أقصى عمق تداخل خاصًّا بها، فإعداد الأداة هو الذي يسري.', { exact: true }).count()).toBe(1)
    await depthHelp.press('Enter')
    expect(await depthRules.count()).toBe(0)
    expect(await depth.inputValue()).toBe('2')
    await panel.getByRole('button', { name: 'عن حد التوازي للوكلاء الفرعيين', exact: true }).click()
    const capacityRules = panel.getByRole('region', { name: 'عن حد التوازي للوكلاء الفرعيين', exact: true })
    expect(await capacityRules.getByText('إجمالي الوكلاء الفرعيين العاملين تحت الوكيل الرئيسي نفسه، عبر كل مستويات التداخل، دون احتساب الوكيل الرئيسي. عند بلوغ الحد تُرفض طلبات البدء الجديدة.', { exact: true }).count()).toBe(1)
    await panel.getByRole('button', { name: 'العودة إلى الإضافات', exact: true }).click()
    await openPage(panel, 'Subagent')
    expect(await depth.inputValue()).toBe('1')
  })

  it('saves limits and the model allowlist together from the shared card', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-subagent-model-selection'))
    const panel = await openPlugins()
    await openPage(panel, 'Subagent')
    const toggle = panel.getByRole('switch', { name: 'السماح للوكلاء باختيار نماذج للوكلاء الفرعيين' })

    await panel.getByLabel('أقصى عمق للتداخل', { exact: true }).fill('2')
    await toggle.click()
    const models = panel.getByRole('group', { name: 'النماذج التي يمكن للوكلاء اختيارها' })
    await models.waitFor({ timeout: 10_000 })
    const firstModel = models.getByRole('checkbox').first()
    await firstModel.check()
    const save = panel.getByRole('button', { name: 'حفظ', exact: true })
    await save.click()

    await expect.poll(async () => (await settingsDocument()).includes('subagent-model-selection:'), { timeout: 10_000 })
      .toBe(true)
    expect(await settingsDocument()).toContain('maxDepth: 2')
    expect(await settingsDocument()).toContain('enabled: true')
    expect(await settingsDocument()).toContain('allowedModels:')
    expect(await settingsDocument()).toContain('provider:')
    expect(await settingsDocument()).toContain('model:')
    // The page stays open once the save landed; a settled form offers no save to repeat.
    await expect.poll(() => toggle.getAttribute('aria-checked'), { timeout: 5_000 }).toBe('true')
    await expect.poll(() => save.isDisabled(), { timeout: 5_000 }).toBe(true)

    await toggle.click()
    await save.click()
    await expect.poll(async () => (await settingsDocument()).includes('enabled: false'), { timeout: 10_000 })
      .toBe(true)
    await expect.poll(() => toggle.getAttribute('aria-checked'), { timeout: 5_000 }).toBe('false')
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('stages an edit and writes it only when saved', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-write'))
    const panel = await openPlugins()
    await openPage(panel, 'الصدفة')

    const timeout = panel.getByLabel('أمر مهلة (مللي ث)')
    await timeout.waitFor({ timeout: 10_000 })
    // The composed default this deployment ships, before any user layer.
    expect(await timeout.inputValue()).toBe('60000')
    await timeout.fill('12000')
    await timeout.blur()

    // Nothing crosses the wire until the user saves: leaving the control is
    // not a decision to store the value.
    expect(await settingsDocument()).not.toContain('timeoutMs')
    const save = panel.getByRole('button', { name: 'حفظ', exact: true })
    await expect.poll(() => save.isEnabled(), { timeout: 5_000 }).toBe(true)
    await save.click()

    await expect.poll(async () => (await settingsDocument()).includes('timeoutMs: 12000'), { timeout: 10_000 })
      .toBe(true)
    // Presence in the user layer is what the badge reports, and the reset is
    // offered only for a field that has one.
    await expect.poll(() => panel.getByText('متجاوَز').count(), { timeout: 5_000 }).toBe(1)
    expect(await panel.getByRole('button', { name: 'إعادة التعيين إلى الافتراضي' }).count()).toBe(1)
    // A settled form offers no save to repeat.
    await expect.poll(() => save.isDisabled(), { timeout: 5_000 }).toBe(true)
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('drops a staged edit when the page is left, without touching the document', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-leave'))
    const panel = await openPlugins()
    await openPage(panel, 'الصدفة')
    const timeout = panel.getByLabel('أمر مهلة (مللي ث)')
    await timeout.waitFor({ timeout: 10_000 })

    await timeout.fill('7000')
    await panel.getByRole('button', { name: 'العودة إلى الإضافات' }).click()
    await panel.getByRole('heading', { name: 'رسمية', exact: true }).waitFor({ timeout: 10_000 })
    await openPage(panel, 'الصدفة')

    await expect.poll(() => panel.getByLabel('أمر مهلة (مللي ث)').inputValue(), { timeout: 5_000 }).toBe('12000')
    expect(await settingsDocument()).toContain('timeoutMs: 12000')
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('refuses to save a draft that is not a number', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-invalid'))
    const panel = await openPlugins()
    await openPage(panel, 'الصدفة')
    const timeout = panel.getByLabel('أمر مهلة (مللي ث)')
    await timeout.waitFor({ timeout: 10_000 })

    await timeout.fill('soon')

    const save = panel.getByRole('button', { name: 'حفظ', exact: true })
    await expect.poll(() => save.isDisabled(), { timeout: 5_000 }).toBe(true)
    expect(await panel.getByText('أدخل رقمًا، أو اترك الحقل فارغًا لاستخدام القيمة الافتراضية.').count()).toBe(1)
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('clears the field back to the composed default on reset', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-reset'))
    const panel = await openPlugins()
    await openPage(panel, 'الصدفة')
    const timeout = panel.getByLabel('أمر مهلة (مللي ث)')
    await timeout.waitFor({ timeout: 10_000 })
    expect(await timeout.inputValue()).toBe('12000')

    // The reset stages the composed default; the document still carries the
    // override until the save lands.
    await panel.getByRole('button', { name: 'إعادة التعيين إلى الافتراضي' }).click()
    await expect.poll(() => timeout.inputValue(), { timeout: 5_000 }).toBe('60000')
    expect(await settingsDocument()).toContain('timeoutMs: 12000')

    await panel.getByRole('button', { name: 'حفظ', exact: true }).click()

    await expect.poll(async () => (await settingsDocument()).includes('timeoutMs'), { timeout: 10_000 })
      .toBe(false)
    expect(await timeout.inputValue()).toBe('60000')
    expect(await panel.getByText('متجاوَز').count()).toBe(0)
    expect(tripwire.pageErrors).toEqual([])
  }, 60_000)

  it('renders a community bundle\'s row configuration, registered by its browser half, on the row\'s page', async () => {
    onTestFailed(() => saveFailureShot(page, 'web-e2e-plugin-config-row'))
    const panel = await openPlugins()

    // Off, the bundle's browser half is not loaded and the row has no configuration to open.
    await panel.getByRole('button', { name: 'عرض live-client', exact: true }).click()
    const row = panel.locator('[data-plugin-row]', { hasText: 'fixture-live-client' })
    await row.waitFor({ timeout: 10_000 })
    expect(await panel.getByRole('button', { name: 'إعداد fixture-live-client' }).count()).toBe(0)

    // Switched on, the Host recomposes and the browser half mounts without a
    // reload; its registration puts the configure control on the row.
    await panel.getByRole('switch', { name: 'تفعيل live-client' }).click()
    const configure = panel.getByRole('button', { name: 'إعداد fixture-live-client' })
    await configure.waitFor({ timeout: 30_000 })
    await configure.click()

    const rowPage = panel.locator('[data-plugin-row-detail="@fixture/live-client#fixture-live-client"]')
    await rowPage.waitFor({ timeout: 10_000 })
    expect(await rowPage.getByRole('heading', { level: 3 }).textContent()).toBe('fixture-live-client')
    expect(await rowPage.getByText('عرض مثال بند إعداد', { exact: true }).count()).toBe(1)
    const form = rowPage.getByRole('form', { name: 'حركة حالة إضافة إعداد' })
    await form.getByLabel('سؤال انتظار لغة').fill('أنت جيد')
    await form.getByRole('button', { name: 'حفظ' }).click()
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.liveSaves), { timeout: 5_000 }).toBe('1')

    const snapshot = await captureStableAria(page, '[data-plugin-panel]', scaffold.workspaceCwd)
    await compareOrRefreshGolden(ROW_EXPECTED, snapshot, MODE)
    await rowPage.getByRole('button', { name: 'العودة إلى live-client' }).click()
    await panel.locator('[data-plugin-detail="@fixture/live-client"]').waitFor({ timeout: 10_000 })
    expect(tripwire.pageErrors).toEqual([])
  }, 90_000)

  it.skipIf(MODE === 'record')('keeps the fixture inventory closed', async () => {
    expect(tripwire.warnings).toEqual([])
    await assertFixtureInventory(SNAPSHOT_DIR, ['official.expected.md', 'row.expected.md', 'subagent.expected.md'])
  })
})
