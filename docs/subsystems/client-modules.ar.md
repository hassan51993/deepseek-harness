# وحدات العميل

[English](client-modules.md) | العربية

جدولُ إضافات الوِب: النصفُ الذي يعمل على Node من نظام وحدات العميل في [dsh-client-modules](../../packages/client/modules)، ويُقدَّم باسم `ctx.clientModules` (`ClientModuleRegistry`). وهو يمسح مداخلَ مُحمِّل المضيف بحثًا عن حزم تعلن `dsh.client`، ويركّب رسمَ مداخل `window.__DSH_BOOT__`، ويقدّم سكربتاتٍ مجمَّعة موسومة بإصدارات لمورد واحد أو أكثر تحت `/plugins`، ويجيب كلَّ جمع لحقن index بصفوف بروتوكول الإقلاع — وهي أوجهُ خدمة واحدة الأربعة. وهو قدرةٌ اختيارية في مكدّس الواجهة الرسومية للوِب، لا جزءٌ من عمود agent loop، وهو مستهلكٌ لـ[dsh-host-webserver](../../packages/host/webserver): فالناقلُ الموصوف في [web-server.md](web-server.ar.md) يقدّم مسارَ البادئة وحدثَ `webserver/index-inject` الذي تجيب عنه هذه الخدمة. أما نصفُ المتصفح في الحزمة نفسِها (`ctx.modules`، وهو جدولُ وحدات CJS الكسول الذي يجلب هذه الحزمَ ويجسّدها) فآلةُ نواة موثَّقة في [README الحزمة](../../packages/client/modules/README.ar.md)، لا هنا.

المصدر: [`packages/client/modules/src/client/manifest.ts`](../../packages/client/modules/src/client/manifest.ts)

## الشبكة

الرسمُ هو المصدرُ الوحيد على الشبكة بين نصفَي Node والمتصفح. ويركّب المضيفُ صفوفَ `WebBootEntry` وواصفاتِ `WebBootBatch` من الحزم الممسوحة، ثم يسهم بواجهة التسجيل والتحميلات المسبقة للتطبيق وسكربتات الإقلاع والرسم العام في جدول حقن index المبنيَن قبل مدخل Vite. ويُعرض صفُّ `global` بالصيغة `globalThis["__DSH_BOOT__"]` مع إفلات `<` فلا تستطيع سلاسلُ تتحكم بها إضافةٌ الخروجَ من عنصر السكربت. والصفحةُ بلا بيان صالح لا تستطيع الإقلاعَ: فمحلِّلُ المتصفح يرفض الصفوفَ أو الدفعاتِ المشوَّهة، والأعضاءَ المجهولين، والمداخلَ التي لا تحمل واصفَ دفعة ابتدائية واحدًا بالضبط.

```ts type-equiv
/**
 * One composed client entry pushed by the host (a graph row). Wire
 * single source: the host node half (package root) produces this same shape.
 * `immediately` marks stage-one prefetch. `inject` names package rows whose
 * factories must arrive before this row materializes, while Cordis separately
 * uses the same package edges to compose entries. `external` carries exact
 * non-inject module requests (see {@link WebBootGraph.entries}).
 */
interface WebBootEntry {
  /** Entry name == package name. */
  id: string
  /** Revisioned single-resource combo endpoint used by HMR. */
  url: string
  /** Opaque plugin-artifact revision used for HMR cache busting. */
  rev: string
  /** Package-name dependency edges used for factory arrival and plugin composition. */
  inject?: string[]
  /** Stage-one prefetch mark: load the script for factory registration during module-face boot. */
  immediately?: boolean
  /** Non-baseline module specifiers this row requests; omitted when it requests none. */
  external?: string[]
}
```

```ts type-equiv
/** Initial scheduling phase for one revisioned combo script. */
type WebBootBatchPhase = 'bootstrap' | 'application'
```

```ts type-equiv
/** One initial combo script; a scheduling phase may span several descriptors. */
interface WebBootBatch {
  /** Parser-blocking bootstrap or preloaded application scheduling. */
  phase: WebBootBatchPhase
  /** Revisioned combo script endpoint. */
  url: string
  /** Revision derived from the ordered entry revisions. */
  rev: string
  /** Graph entry ids whose factories the script registers, in execution order. */
  entries: string[]
}
```

```ts type-equiv
/** The composed client entry graph the host injects as `window.__DSH_BOOT__`. */
interface WebBootGraph {
  /** Consistency anchor over the current entry and batch descriptors. */
  rev: string
  /**
   * Composed entries in module-graph order — a dynamic package row precedes
   * rows whose `external` requests that package. Cordis activation order is
   * unrelated and remains owned by fiber service waiting.
   */
  entries: WebBootEntry[]
  /** Initial combo descriptors; every entry belongs to exactly one descriptor. */
  batches: WebBootBatch[]
}
```

و`rev` في كل صف ابتدائي رقمٌ عشوائي معتم للعملية مع تسلسل، فلا يبصم تركيبُ الرسم كلَّ أثر إضافة. وبعد أن يرصد HMR تغيُّرَ حزمة، تصير مراجعةُ ذلك الصف بصمةَ بايتاتها التنفيذية الجديدة. وتقسم الواصفاتُ الابتدائية الصفوفَ إلى طورَي جدولة، إقلاعٍ وتطبيق، وقد يحتوي أيٌّ من الطورين عدةَ واصفات. ولا تحتوي روابطُها إلا قائمةَ موارد الحزم المرتَّبة ومراجعةً مشتقة من مراجعات تلك الصفوف؛ ولا تدخل أسماءُ الأطوار المسار. ويحفظ تركيبُ الرسم ترتيبَ الصفوف مع التقسيم الجشع قبل أن يتجاوز الرابطُ بصيغة الخريطة 3 كيبي بايت، بلا دمج السكربتات وبلا قراءة الخرائط. وتبصم مراجعةُ الرسم واصفاتِ المداخل والدفعات. و`immediately` تعلّم حاجزَ التسجيل في المرحلة الأولى؛ وتتشارك الصفوفُ داخل دفعة واحدة نقلَ سكربتها، بينما تُحمَّل الدفعاتُ المنفصلة مستقلةً.

## المسح

تنضم الحزمةُ إلى الجدول بإعلان `dsh.client` (`platform: 'web'`، وحوافُّ `inject` اختيارية، و`immediately` اختيارية) في ملف package.json الخاص بها وبتصدير حزمتها المبنية عند `exports["./client"]`. ويُحلّ كلُّ صف حي من محدِّده في المُحمِّل ومن `baseUrl` شجرته المالكة، عبر تنفيذ `loader.internal.resolveSync` نفسِه الذي يستورد وجهَه في المضيف حين يتوفر. ويقدّم بيانُ الحزمة المالكة الأقرب معرّفَ وحدة المتصفح، فتحتفظ تراكباتُ المصدر النسبية والمبنية بهوية الحزمة. ومصادرُ المُحمِّل النشطة المتمايزة التي تُحلّ إلى اسم حزمة واحد تُفشل التركيبَ؛ وبعد تفريغ مصدر واحد، يقدّم المصدرُ الباقي الصفَّ بلا إعادة تشغيل الليف.

والمسحُ تدريجي لكل حزمة؛ ولا مسارَ شفرة لإعادة مسح كامل. فكلُّ إطلاق `internal/plugin` من cordis (إنشاءُ ليف أو التخلصُ منه) يعلّم اسمَ مدخل الليف متسخًا، ويوفّق دفعُ مهمة دقيقة كلَّ اسم متسخ في مقابل مداخل المُحمِّل الحية. ويبذر مرورُ التفعيل مجموعةَ المتسخ نفسَها بكل المداخل الحالية ويدفعها متزامنًا، فيتشارك المسحُ الأول والحالةُ المستقرة تنفيذًا واحدًا — بوضعَي فشل متعاكسين. فعند التفعيل، يتجمع التصريحُ المشوَّه أو الحزمةُ المفقودة بين المداخل المحمَّلة سلفًا في خطأ `AggregateError` واحد عالي الصوت يعدّد كلَّ حزمة معطوبة: فيفشل الليفُ ويبلّغ عنه كنسُ الإقلاع الصارخ. وفي الحالة المستقرة، تسجّل الحزمةُ المعطوبة تحذيرًا ويجب ألّا تسمّم غيرَها.

وتُخزَّن البياناتُ الوصفية للحزمة — ومنها الحكمُ السلبي «ليست حزمةَ عميل» — لكل محدِّد في المُحمِّل ولكل رابط أساس للشجرة المالكة حتى إعادة التشغيل. وإعادةُ تشغيل ليف من المصدر نفسِه تعيد استعمالَ صفه ومراجعته بلا مساس؛ ولا يبلغ تغيُّرُ محتوى الحزمة الرسمَ إلا عبر `rebuilt()`.

## مسار الحزم وحقن index

يخاطب `GET`/`HEAD /plugins/??<package-a>/client.js,<package-b>/client.js&rev=<rev>` سكربتًا مجمَّعًا واحدًا مولَّدًا؛ ويستعمل طلبُ المورد الواحد الصيغةَ نفسَها وهو مسارُ HMR. ويُدمج السكربتُ مرةً واحدة عند أول `GET` له وينتهي بـ`sourceMappingURL` مطلق لواحقُ موارده `.js.map`. ولا تُقرأ ملفاتُ الخرائط عند الإقلاع ولا عند عرض index ولا عند `GET` السكربت ولا عند `HEAD`؛ وأولُ `GET` لخريطة يقرؤها ويتحقق منها، ويركّب خريطةَ مصادر مفهرَسة من الإصدار 3، ويخزّن ذلك الجسم. وتقدّم خريطةُ المكوّن المؤلَّفة قسمَها؛ ويتلقى المكوّنُ بلا خريطة قسمَ هوية يكون `sourcesContent` فيه هو الحزمةَ الملتقَطة واسمُ مصدره هو `sourceURL` المحزوم لديه أو مسارَ الإضافة. وكلُّ رابط طلب عند الإقلاع 3 كيبي بايت على الأكثر مقيسةً بايتاتِ UTF-8؛ ويستعمل التقسيمُ صيغةَ الخريطة الأطول. وتُحمَّل روابطُ التطبيق كلُّها مسبقًا، وتُنفَّذ روابطُ الإقلاع كلُّها قبل الرسم العام ومدخل Vite. وتستعمل الاستجاباتُ المجسَّدة تخزينًا مؤقتًا طويلَ الأمد غيرَ قابل للتغيير. وتُجاب قوائمُ الموارد المجهولة أو المبدَّلة والمراجعاتُ المفقودة والمراجعاتُ القديمة بـ404 بدل تقديم بايتات مختلفة أو ترك احتياطي تطبيق الصفحة الواحدة يعيد HTML بوصفه JavaScript؛ وسائرُ الطرائق تُجاب بـ405. وتحمل صفوفُ الحقن الرسمَ الحالي عند كل عرض لـindex، فتُقلع كلُّ إعادة تحميل في مقابل التركيب الحي.

## الخدمة

```ts type-equiv
/** Filesystem baseline captured before a client artifact snapshot is read. */
interface ClientArtifactBaseline {
  /** Absolute path of the client bundle. */
  readonly path: string
  /** Bundle modification time in milliseconds. */
  readonly mtimeMs: number
  /** Bundle size in bytes. */
  readonly size: number
}
```

ويكشف `ClientModuleRegistry` (`ctx.clientModules`، المعرَّف في [`packages/client/modules/src/index.ts`](../../packages/client/modules/src/index.ts)) القراءاتِ ووجهَ إعادة البناء؛ والتوقيعاتُ في [دليل الخدمات](#ctxclientmodules--clientmoduleregistry) المولَّد. ويعيد `graph()` الرسمَ المركَّب الحالي (وهو كائنٌ ثابت بين التغييرات)، ويعيد `clientPath(id)` المسارَ المطلق للحزمة، ويعيد `artifactBaseline(id)` قيمَ stat للحزمة الملتقَطة قبل قراءة اللقطة الحالية. ويحلّ `fetchBundle()` الاستجابةَ الكسولة نفسَها التي يستعملها مسارُ HTTP. و`rebuilt(id)` هي نقطةُ الدخول الوحيدة التي يبلغ عبرها محتوى الحزمة المتغيّر الرسمَ: فهي تعيد بصمَ بايتات الحزمة، ولا يعيد تركيبَ الرسم ويُشعر إلا تغيُّرُ مراجعة حقيقي. ويُطلق `onRebuilt` لكل حزمة متغيّرة بالمراجعة الجديدة؛ ويُطلق `onGraphChanged` بعد أي دفع أعاد تركيبَ الرسم (بإضافة صف أو إزالته، أو بتغيُّر مراجعة معادة البناء) وهو بنموذج السحب — فيعيد المستمعون قراءةَ `graph()`. ويحتوي مسارا الإشعار استثناءاتِ المستمعين، فلا يستطيع مشترِكٌ رامٍ أن يتخطى مشترِكين لاحقين ولا أن يقتل ما أطلق الدفعَ.

وتسلّم [`dsh-client-hmr`](../../packages/client/hmr/README.ar.md) لقطاتِ رسم حية في تركيب Web المشحون. ويمرّر المضيفُ إشعاراتِ تغيُّر الرسم القائمة فورًا، وترسل إعادةُ الاتصال الرسمَ الكامل الحالي. والرسمُ يصف مداخلَ المتصفح المرجوة بلا أن يؤكد اكتمالَ تنظيف المضيف. ويبلّغ استطلاعُ آثاره على حدة عن المراجعات المعادة البناء. وتغييراتُ خرائط المصادر وحدها لا تُطلق إعادةَ تحميل؛ ولا يظهر رابطُ خريطة مجمَّعة جديد إلا بعد تغيُّر مراجعة حزمة، ويُثبَّت كلُّ جسم خريطة بأول `GET` له. وتتحقق وحداتُ العميل من اللقطات وتسلسل التوفيقَ مع عمليات إعادة البناء تلك؛ وهي تملك خريطةَ المداخل المنشأة عند الإقلاع، ووصولَ المورد الواحد، والإزالةَ اللاتزامنية، وتنظيفَ الوحدات والأنماط غير المستعملة، وحالةَ إعادة المحاولة المحلية في الصفحة. وتحتفظ وحداتُ المنصة الساكنة والإقلاعُ بعمر الصفحة؛ وتثبيتُ Electron مسارٌ منفصل.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxclientmodules--clientmoduleregistry"></a>

### `ctx.clientModules` — `ClientModuleRegistry`

The web plugin table service: incremental `dsh.client` scan + wire composition + bundle route + index injection rows. Construction runs the activation scan synchronously — a malformed declaration or missing bundle among the already-loaded entries aggregates into one loud throw (FAILED fiber; the boot activation audit reports it).

```ts cordis-catalog
/**
 * Current composed entry graph (stable object between changes).
 * @returns the graph served as `window.__DSH_BOOT__`.
 */
graph(): WebBootGraph

/**
 * Absolute path of an entry's client bundle.
 * @param id - entry id (package name).
 * @returns the path, or undefined for an unknown id.
 */
clientPath(id: string): string | undefined

/**
 * Serve an advertised revisioned bundle or source map without a Web server.
 * Unknown URLs return 404, unsupported methods return 405, and `HEAD`
 * returns the same immutable headers without materializing a body. Each body
 * is built once on its first `GET`; script construction never reads maps.
 * @param request - shell-carrier request for a `/plugins` resource.
 * @returns the exact response also exposed by the optional Web route.
 */
async fetchBundle(request: Request): Promise<Response>

/**
 * Filesystem baseline captured before an entry's current bytes were read.
 * HMR compares it with the live files when installing a watch, so a write
 * between startup composition and watch installation cannot disappear into
 * the watcher's initial state.
 * @param id - entry id (package name).
 * @returns the path and baseline, or undefined for an unknown id.
 */
artifactBaseline(id: string): ClientArtifactBaseline | undefined

/**
 * Publish one completed bundle generation (the HMR watch's registration
 * hook — the only entry point through which build changes reach the graph).
 * @param id - entry id (package name).
 * @returns the new rev, or undefined for an unknown id.
 */
rebuilt(id: string): string | undefined

/**
 * Subscribe to bundle rebuilds; fires only when the re-hash changed the rev.
 * @param listener - receives the entry id and its new bundle rev.
 * @returns the unsubscriber.
 */
onRebuilt(listener: (id: string, rev: string) => void): () => void

/**
 * Fires after any flush that recomposed the graph (row added/removed, or a
 * rebuilt rev change). Pull model: listeners re-read {@link graph}.
 * @param listener - notified with no payload.
 * @returns the unsubscriber.
 */
onGraphChanged(listener: () => void): () => void
```

Source: [`packages/client/modules/src/index.ts`](../../packages/client/modules/src/index.ts)
<!-- END GENERATED cordis-surface -->
