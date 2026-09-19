/**
 * Canonical publication manifest for the documentation website.
 *
 * Markdown stays in its owning repository tier. This manifest maps each
 * canonical source into matching route trees for both site locales; when a
 * translation is absent, both routes intentionally project the available
 * source instead of copying Markdown.
 */

/** Locale key used by the VitePress site. */
export type DocsLocale = 'root' | 'en'

/** Sidebar collection rendered for one locale and top-level module. */
export type DocsSidebar =
  | 'ar-guide'
  | 'ar-develop'
  | 'ar-reference'
  | 'en-guide'
  | 'en-develop'
  | 'en-reference'

/** A page projected into the VitePress source tree. */
export interface DocsPage {
  /** VitePress locale whose route tree owns this projection. */
  locale: DocsLocale
  /** Language of the canonical source currently projected at this route. */
  contentLocale: 'ar-SA' | 'en-US'
  /** Repository-relative canonical Markdown source. */
  source: string
  /** VitePress route, including the `.md` suffix. */
  route: string
  /** Navigation label shown in the sidebar. */
  label: string
  /** Sidebar collection that owns the page, or null for a locale home page. */
  sidebar: DocsSidebar | null
  /** Section label within the sidebar. */
  section: string
  /** Stable order within the section. */
  order: number
  /** Heading levels included in this page's VitePress outline. */
  outline?: number | readonly [number, number] | 'deep' | false
  /** Additional repository paths that resolve to this page. */
  sourceAliases?: string[]
}

interface MirroredPage {
  source: string | Record<DocsLocale, string>
  route: string
  contentLocale: DocsPage['contentLocale'] | Record<DocsLocale, DocsPage['contentLocale']>
  label: Record<DocsLocale, string>
  sidebar: Record<DocsLocale, DocsSidebar | null>
  section: Record<DocsLocale, string>
  order: number
  outline?: DocsPage['outline']
  sourceAliases?: string[] | Partial<Record<DocsLocale, string[]>>
}

type PairedPage = Omit<MirroredPage, 'source' | 'contentLocale' | 'sourceAliases'> & {
  /** English side of a sibling `foo.md` / `foo.ar.md` pair. */
  source: string
  /** Language-neutral repository aliases, such as the directory of an index page. */
  sourceAliases?: string[]
}

function localized<T>(value: T | Record<DocsLocale, T>, locale: DocsLocale): T {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<DocsLocale, T>)[locale]
    : value
}

function mirroredPages(pages: MirroredPage[]): DocsPage[] {
  return pages.flatMap(page => (['root', 'en'] as const).map((locale) => {
    const aliases = page.sourceAliases === undefined
      ? undefined
      : Array.isArray(page.sourceAliases) ? page.sourceAliases : page.sourceAliases[locale]
    return {
      locale,
      contentLocale: localized(page.contentLocale, locale),
      source: localized(page.source, locale),
      route: locale === 'root' ? page.route : `en/${page.route}`,
      label: page.label[locale],
      sidebar: page.sidebar[locale],
      section: page.section[locale],
      order: page.order,
      ...(page.outline === undefined ? {} : { outline: page.outline }),
      ...(aliases === undefined ? {} : { sourceAliases: aliases }),
    }
  }))
}

function pairedPages(pages: PairedPage[]): DocsPage[] {
  return mirroredPages(pages.map((page) => {
    const arabicSource = page.source.replace(/\.md$/, '.ar.md')
    const sharedAliases = page.sourceAliases ?? []
    return {
      ...page,
      source: { root: arabicSource, en: page.source },
      contentLocale: { root: 'ar-SA', en: 'en-US' },
      sourceAliases: {
        root: [...sharedAliases, page.source],
        en: [...sharedAliases, arabicSource],
      },
    }
  }))
}

const homeAndGuide = pairedPages([
  {
    source: 'docs/user/index.md',
    route: 'index.md',
    label: { root: 'DeepSeek Harness', en: 'DeepSeek Harness' },
    sidebar: { root: null, en: null },
    section: { root: 'أول صفحة', en: 'Home' },
    order: 0,
  },
  {
    source: 'docs/user/guide/index.md',
    route: 'guide/quickstart.md',
    label: { root: 'استخدام Web UI', en: 'Use the Web UI' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'دخول باب', en: 'Guide' },
    order: 1,
    sourceAliases: ['docs/user/guide'],
  },
  {
    source: 'docs/user/guide/providers.md',
    route: 'guide/providers.md',
    label: { root: 'إعداد نموذج', en: 'Configure models' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'دخول باب', en: 'Guide' },
    order: 2,
  },
  {
    source: 'docs/user/guide/network-proxy.md',
    route: 'guide/network-proxy.md',
    label: { root: 'شبكة بديل إدارة', en: 'Network proxy' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'دخول باب', en: 'Guide' },
    order: 3,
  },
  {
    source: 'docs/user/guide/python-sdk.md',
    route: 'guide/python-sdk.md',
    label: { root: 'Python', en: 'Python' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'SDK', en: 'SDK' },
    order: 1,
  },
  {
    source: 'docs/user/guide/github-review.md',
    route: 'guide/github-review.md',
    label: { root: 'GitHub مراجعة جلسة', en: 'GitHub review sessions' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'تلقائي تحويل', en: 'Automation' },
    order: 1,
  },
  {
    source: 'docs/user/guide/schedule.md',
    route: 'guide/schedule.md',
    label: { root: 'جلسة داخل رفع تنبيه', en: 'Session reminders' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'تلقائي تحويل', en: 'Automation' },
    order: 2,
  },
  {
    source: 'docs/user/guide/mcp-memory.md',
    route: 'guide/mcp-memory.md',
    label: { root: 'تسجيل ذاكرة MCP', en: 'Memory MCP' },
    sidebar: { root: 'ar-guide', en: 'en-guide' },
    section: { root: 'تجميع صار', en: 'Integrations' },
    order: 1,
  },
])

const develop = pairedPages([
  {
    source: 'docs/user/develop/basic/index.md',
    route: 'develop/basic/index.md',
    label: { root: 'رقم واحد Harness إضافة', en: 'Your first Harness plugin' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'أساس أساس', en: 'Basics' },
    order: 1,
    sourceAliases: ['docs/user/develop/basic'],
  },
  {
    source: 'docs/user/develop/basic/tool.md',
    route: 'develop/basic/tool.md',
    label: { root: 'تطوير واحد Tool', en: 'Build a tool' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'أساس أساس', en: 'Basics' },
    order: 2,
  },
  {
    source: 'docs/user/develop/basic/config.md',
    route: 'develop/basic/config.md',
    label: { root: 'إضافة إعداد', en: 'Plugin configuration' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'أساس أساس', en: 'Basics' },
    order: 3,
  },
  {
    source: 'docs/user/develop/basic/publish.md',
    route: 'develop/basic/publish.md',
    label: { root: 'تحزيم و تثبيت إضافة', en: 'Package and install' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'أساس أساس', en: 'Basics' },
    order: 4,
  },
  {
    source: 'docs/user/develop/framework/index.md',
    route: 'develop/framework/index.md',
    label: { root: 'إضافة و دورة الحياة', en: 'Plugin lifecycle' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'إطار هيكل قدرة', en: 'Framework' },
    order: 1,
    sourceAliases: ['docs/user/develop/framework'],
  },
  {
    source: 'docs/user/develop/framework/service.md',
    route: 'develop/framework/service.md',
    label: { root: 'خدمة و اعتماد', en: 'Services and dependencies' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'إطار هيكل قدرة', en: 'Framework' },
    order: 2,
  },
  {
    source: 'docs/user/develop/framework/events.md',
    route: 'develop/framework/events.md',
    label: { root: 'حدث نظام', en: 'Event system' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'إطار هيكل قدرة', en: 'Framework' },
    order: 3,
  },
  {
    source: 'docs/user/develop/practice/index.md',
    route: 'develop/practice/index.md',
    label: { root: 'قدرة ثلاثة طبقة تفكيك قسم', en: 'Capability layering' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'فعلي حرب', en: 'Practice' },
    order: 1,
    sourceAliases: ['docs/user/develop/practice'],
  },
  {
    source: 'docs/user/develop/practice/llm-adapter.md',
    route: 'develop/practice/llm-adapter.md',
    label: { root: 'LLM مهايئ', en: 'LLM adapter' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'فعلي حرب', en: 'Practice' },
    order: 2,
  },
  {
    source: 'docs/user/develop/practice/dynamic-cordis.md',
    route: 'develop/practice/dynamic-cordis.md',
    label: { root: 'حفظ دائم Harness إضافة', en: 'Persistent Harness plugins' },
    sidebar: { root: 'ar-develop', en: 'en-develop' },
    section: { root: 'فعلي حرب', en: 'Practice' },
    order: 3,
  },
])

const cordisTutorial = pairedPages(([
  ['index.md', 'مجموع تصفح', 'Overview'],
  ['01-first-plugin.md', '1. رقم واحد إضافة', '1. Your first plugin'],
  ['02-lifecycle-and-effects.md', '2. دورة الحياة و فرعي أثر', '2. Lifecycle and effects'],
  ['03-services.md', '3. خدمة', '3. Services'],
  ['04-events.md', '4. حدث', '4. Events'],
  ['05-config.md', '5. إعداد', '5. Configuration'],
  ['06-composition-and-hmr.md', '6. تركيب و حار إعادة تحميل', '6. Composition and HMR'],
  ['07-into-the-harness.md', '7. دخول Harness', '7. Into the harness'],
] as const).map(([file, rootLabel, enLabel], order): PairedPage => ({
  source: `docs/cordis-tutorial/${file}`,
  route: `develop/cordis-tutorial/${file}`,
  label: { root: rootLabel, en: enLabel },
  sidebar: { root: 'ar-develop', en: 'en-develop' },
  section: { root: 'Cordis إطار هيكل تعليم مسار', en: 'Cordis framework tutorial' },
  order,
  ...(file === 'index.md' ? { sourceAliases: ['docs/cordis-tutorial'] } : {}),
})))

const cordisPrimerReference = pairedPages([
  {
    source: 'docs/cordis-primer.md',
    route: 'reference/cordis-primer.md',
    label: { root: 'Cordis دخول باب', en: 'Cordis primer' },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'عام فكرة', en: 'Concepts' },
    order: 1,
  },
])

/**
 * Subsystem pages grouped by the concern they document, as `[Arabic section,
 * English section, pages]`. One flat list of every subsystem pushed the rest of
 * the reference sidebar below the fold.
 */
const subsystemGroups = [
  ['مجموع تصفح', 'Overview', [
    ['README.md', 'فرعي نظام', 'Subsystems'],
  ]],
  ['داخل نواة و أثر مجال', 'Core and scopes', [
    ['core.md', 'نواة قلب', 'Core'],
    ['scope.md', 'أثر مجال', 'Scopes'],
    ['invariants.md', 'وقت التشغيل ثابت صيغة', 'Runtime invariants'],
  ]],
  ['جلسة و حفظ دائم', 'Sessions and persistence', [
    ['session.md', 'جلسة', 'Sessions'],
    ['session-query.md', 'جلسة استعلام', 'Session query'],
    ['session-reference.md', 'جلسة مرجع', 'Session references'],
    ['session-title.md', 'جلسة عنوان', 'Session titles'],
    ['session-projection.md', 'جلسة إسقاط', 'Session projections'],
    ['persistence.md', 'جلسة حفظ دائم', 'Session persistence'],
    ['spill.md', 'Spill تخزين', 'Spill storage'],
    ['session-telemetry.md', 'بعيد قياس', 'SessionTelemetryBackend'],
  ]],
  ['نموذج و سياق', 'Model and context', [
    ['llm-streaming.md', 'LLM تدفق صيغة استجابة', 'LLM streaming'],
    ['token-meter.md', 'Token حساب كمية', 'Token metering'],
    ['system-prompt.md', 'توجيه النظام', 'System prompts'],
    ['compaction.md', 'سياق ضغط', 'Compaction'],
  ]],
  ['تنفيذ و أداة', 'Execution and tools', [
    ['tools.md', 'أداة', 'Tools'],
    ['shell.md', 'Bash تنفيذ', 'Bash execution'],
    ['subprocess.md', 'عملية فرعية', 'Subprocesses'],
    ['terminal.md', 'PTY جلسة', 'PTY sessions'],
    ['jobs.md', 'خلفية مهمة', 'Background jobs'],
    ['filesystem.md', 'نظام الملفات', 'Filesystem'],
    ['lsp.md', 'LSP تنقل', 'LSP navigation'],
    ['ptc-runtime.md', 'PTC وقت التشغيل', 'PTC runtime'],
    ['web.md', 'Web وصول', 'Web access'],
    ['skills.md', 'تقنية قدرة', 'Skills'],
    ['workflow.md', 'سير العمل', 'Workflows'],
    ['subagent.md', 'فرعي بديل إدارة', 'Subagents'],
  ]],
  ['سياسة و تفاعل', 'Policy and interaction', [
    ['approval.md', 'مراجعة دفعة', 'Approvals'],
    ['permission-presets.md', 'إذن مسبق ضبط', 'Permission presets'],
    ['sandbox.md', 'صندوق رملي', 'Sandboxing'],
    ['plan.md', 'خطة نمط', 'Plan mode'],
    ['user-questions.md', 'مستخدم تفاعل', 'User interaction'],
    ['commands.md', 'أمر', 'Human commands'],
    ['goal.md', 'هدف', 'Goals'],
    ['schedule.md', 'تحديد وقت رفع تنبيه', 'Scheduled reminders'],
  ]],
  ['منصة و وصل دخول', 'Platform and access', [
    ['web-server.md', 'HTTP خادم', 'HTTP server'],
    ['web-client.md', 'Web Client هيكل بنية', 'Web Client architecture'],
    ['client-modules.md', 'عميل وحدة', 'Client modules'],
    ['slots.md', 'عميل Slots', 'Client slots'],
    ['client-resources.md', 'عميل مورد', 'Client resources'],
    ['sidebar-right.md', 'يمين جانب Sidebar', 'Right Sidebar'],
    ['conversation.md', 'Conversation تجميع', 'Conversation assembly'],
    ['typert.md', 'Typert', 'Typert'],
    ['storage.md', 'تخزين', 'Storage'],
    ['workspace.md', 'مساحة العمل', 'Workspaces'],
    ['settings.md', 'مستخدم ضبط', 'User settings'],
    ['credentials.md', 'مستخدم اعتماد', 'User credentials'],
  ]],
] as const

const subsystemsReference = subsystemGroups.flatMap(([rootSection, enSection, files]) => pairedPages(
  files.map(([file, rootLabel, enLabel], order): PairedPage => ({
    source: `docs/subsystems/${file}`,
    route: file === 'README.md' ? 'reference/subsystems/index.md' : `reference/subsystems/${file}`,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: rootSection, en: enSection },
    order,
    // Subsystem pages carry long third-level sections a two-level outline reaches.
    outline: [2, 3],
    ...(file === 'README.md' ? { sourceAliases: ['docs/subsystems'] } : {}),
  })),
))

const reference = [
  // `docs/deepseek-llm-api-wire-extensions.md` is a repository-only provider protocol reference.
  // Projected links intentionally resolve to its GitHub source instead of a public site route.
  ...pairedPages(([
    ['docs/architecture.md', 'reference/index.md', 'هيكل بنية', 'Architecture', 0],
  ] as const).map(([source, route, rootLabel, enLabel, order]): PairedPage => ({
    source,
    route,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'عام فكرة', en: 'Concepts' },
    order,
  }))),
  ...pairedPages(([
    ['docs/capability-seams.md', 'reference/capability-seams.md', 'قدرة خدمة', 'Capability services', 2],
    ['docs/agent-lifecycle.md', 'reference/agent-lifecycle.md', 'Agent دورة الحياة', 'Agent lifecycle', 3],
    ['docs/tool-execution-pipeline.md', 'reference/tool-execution-pipeline.md', 'Tool تنفيذ', 'Tool execution', 4],
    ['docs/api-gateway.md', 'reference/api-gateway.md', 'API Gateway', 'API Gateway', 5],
  ] as const).map(([source, route, rootLabel, enLabel, order]): PairedPage => ({
    source,
    route,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'عام فكرة', en: 'Concepts' },
    order,
  }))),
  ...pairedPages(([
    ['docs/config-catalog.md', 'reference/config-catalog.md', 'إضافة إعداد', 'Plugin configuration'],
    ['docs/tool-catalog.md', 'reference/tool-catalog.md', 'Tool Schema', 'Tool schemas'],
    ['docs/persistence-catalog.md', 'reference/persistence-catalog.md', 'حفظ دائم حدث', 'Persistence events', 'deep'],
  ] as const).map(([source, route, rootLabel, enLabel, outline], order): PairedPage => ({
    source,
    route,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'توليد مشاركة اعتبار', en: 'Generated reference' },
    order,
    ...(outline === undefined ? {} : { outline }),
  }))),
  ...pairedPages(([
    ['context.md', 'Context', 'Context'],
    ['events.md', 'Events', 'Events'],
    ['fiber.md', 'Fiber', 'Fiber'],
    ['registry.md', 'Plugin Registry', 'Plugin Registry'],
    ['service.md', 'Service', 'Service'],
  ] as const).map(([file, rootLabel, enLabel], order): PairedPage => ({
    source: `docs/cordis-api/${file}`,
    route: `reference/cordis-api/${file}`,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'Cordis API', en: 'Cordis Core API' },
    order,
  }))),
  ...mirroredPages(([
    ['inherited.md', 'وراثة واجهة وجه', 'Inherited surface'],
  ] as const).map(([file, rootLabel, enLabel], order): MirroredPage => ({
    source: `docs/cordis-api/${file}`,
    route: `reference/cordis-api/${file}`,
    contentLocale: 'en-US',
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'Cordis API', en: 'Cordis Core API' },
    order: order + 5,
  }))),
  ...pairedPages(([
    ['adding-a-package.md', 'إضافة جديدة Package', 'Adding a package'],
    ['adding-a-tool.md', 'إضافة جديدة Tool', 'Adding a tool'],
    ['adding-an-llm-adapter.md', 'إضافة جديدة LLM Adapter', 'Adding an LLM adapter'],
    ['adding-a-settings-card.md', 'إضافة جديدة ضبط بطاقة', 'Adding a settings card'],
    ['extension-cookbook.md', 'توسيع نمط', 'Extension patterns'],
  ] as const).map(([file, rootLabel, enLabel], order): PairedPage => ({
    source: `docs/cookbook/${file}`,
    route: `reference/cookbook/${file}`,
    label: { root: rootLabel, en: enLabel },
    sidebar: { root: 'ar-reference', en: 'en-reference' },
    section: { root: 'تطوير يد سجل', en: 'Cookbook' },
    order,
  }))),
]

/**
 * Sidebar collections of each locale, in the order the site's navigation
 * presents them. The navigation bar and the llms.txt index both read this
 * sequence, so a new collection lands in both surfaces together.
 */
export const localeCollections = {
  root: ['ar-guide', 'ar-develop', 'ar-reference'],
  en: ['en-guide', 'en-develop', 'en-reference'],
} as const satisfies Record<DocsLocale, readonly DocsSidebar[]>

/** A sidebar group, matched to pages by `label`. */
export interface DocsSection {
  /** Group heading, equal to the `section` field of every page it holds. */
  label: string
  /** Render the group collapsed until it holds the page being read. */
  collapsed?: boolean
}

/**
 * Every sidebar group, in the order its locale renders it.
 *
 * The subsystem groups collapse because together they outnumber the rest of the
 * reference sidebar; expanded, they push every other group below the fold.
 */
const sections: Record<DocsLocale, readonly DocsSection[]> = {
  root: [
    { label: 'دخول باب' }, { label: 'SDK' }, { label: 'تلقائي تحويل' }, { label: 'تجميع صار' },
    { label: 'أساس أساس' }, { label: 'إطار هيكل قدرة' }, { label: 'فعلي حرب' }, { label: 'Cordis إطار هيكل تعليم مسار' },
    { label: 'عام فكرة' }, { label: 'توليد مشاركة اعتبار' }, { label: 'Cordis API' }, { label: 'تطوير يد سجل' },
    { label: 'مجموع تصفح' },
    { label: 'داخل نواة و أثر مجال', collapsed: true },
    { label: 'جلسة و حفظ دائم', collapsed: true },
    { label: 'نموذج و سياق', collapsed: true },
    { label: 'تنفيذ و أداة', collapsed: true },
    { label: 'سياسة و تفاعل', collapsed: true },
    { label: 'منصة و وصل دخول', collapsed: true },
  ],
  en: [
    { label: 'Guide' }, { label: 'SDK' }, { label: 'Automation' }, { label: 'Integrations' },
    { label: 'Basics' }, { label: 'Framework' }, { label: 'Practice' }, { label: 'Cordis framework tutorial' },
    { label: 'Concepts' }, { label: 'Generated reference' }, { label: 'Cordis Core API' }, { label: 'Cookbook' },
    { label: 'Overview' },
    { label: 'Core and scopes', collapsed: true },
    { label: 'Sessions and persistence', collapsed: true },
    { label: 'Model and context', collapsed: true },
    { label: 'Execution and tools', collapsed: true },
    { label: 'Policy and interaction', collapsed: true },
    { label: 'Platform and access', collapsed: true },
  ],
}

/**
 * Placement and collapse behavior of one sidebar group.
 *
 * @param locale - Route tree whose sidebar is being built.
 * @param label - Section label carried by the pages in the group.
 * @returns The declared group, plus its zero-based position in the locale.
 * @throws When the locale declares no placement for the label. Ranking by list
 *   membership alone would sort an undeclared group silently ahead of every
 *   declared one.
 */
export function sectionSpec(locale: DocsLocale, label: string): DocsSection & { index: number } {
  const declared = sections[locale]
  const section = declared.find(candidate => candidate.label === label)
  if (section === undefined) throw new Error(`Sidebar section "${label}" has no placement in the ${locale} locale.`)
  return { ...section, index: declared.indexOf(section) }
}

/** Every canonical page published by the documentation website. */
export const docsPages: DocsPage[] = [
  ...homeAndGuide,
  ...develop,
  ...cordisTutorial,
  ...cordisPrimerReference,
  ...subsystemsReference,
  ...reference,
]

/**
 * Pages of one sidebar collection, in the order the sidebar lists them.
 *
 * @param locale - Route tree whose sidebar is being built.
 * @param collection - Sidebar collection to read.
 * @returns The collection's pages, ordered by section placement then by `order`.
 */
export function orderedPages(locale: DocsLocale, collection: DocsSidebar): DocsPage[] {
  return docsPages
    .filter(page => page.locale === locale && page.sidebar === collection)
    .sort((left, right) => (
      sectionSpec(locale, left.section).index - sectionSpec(locale, right.section).index
      || left.order - right.order
    ))
}

/**
 * Site-relative link for a published route.
 *
 * @param route - Manifest route, including its `.md` suffix.
 * @returns The link VitePress serves the route at.
 */
export function routeLink(route: string): string {
  return `/${route.replace(/(?:index)?\.md$/, '')}`
}

/**
 * Where a top-level navigation item lands.
 *
 * The target is derived rather than written down: a collection whose first page
 * is renamed or reordered would otherwise leave the navigation bar pointing at
 * a route the manifest no longer publishes.
 *
 * @param locale - Route tree the navigation item belongs to.
 * @param collection - Sidebar collection the item opens.
 * @returns Site-relative link of the collection's first page.
 * @throws When the collection publishes no page.
 */
export function landingLink(locale: DocsLocale, collection: DocsSidebar): string {
  const first = orderedPages(locale, collection)[0]
  if (first === undefined) throw new Error(`Sidebar collection "${collection}" publishes no page.`)
  return routeLink(first.route)
}
