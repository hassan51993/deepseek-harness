# Client وحدة

[English](client-modules.md) | العربية

Web إضافة جدول:[dsh-client-modules](../../packages/client/modules) في client وحدة نظام Node نصف، بـ `ctx.clientModules`(`ClientModuleRegistry`) شكل صيغة توفير. هو مسح مضيف Loader entry، بحث خروج إعلان `dsh.client` حزمة، تركيب خروج `window.__DSH_BOOT__` entry رسم، في `/plugins` تحت توفير حمل إصدار مفرد مورد أو كثير مورد combo نص برمجي، و بـ بدء بروتوكول سطر عودة ينبغي كل مرة index حقن استلام تجميع——هذا هو نفس عدد خدمة أربعة عدد وجه. هو هو Web GUI مكدس واحد بند اختياري قدرة، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، و كما هو [dsh-host-webserver](../../packages/host/webserver) مستهلك:[web-server.md](web-server.zh.md) الذي وصف تحميل جسم توفير هذا خدمة تسجيل بادئة توجيه و ذلك عودة ينبغي `webserver/index-inject` حدث. نفس عدد حزمة متصفح نصف (`ctx.modules`، أي سحب أخذ و شيء تحويل هذه bundle lazy CJS وحدة جدول) يخص داخل نواة آلة عنصر، سجل في[حزمة README](../../packages/client/modules/README.zh.md) في، لا في هذا صفحة.

شفرة المصدر:[`packages/client/modules/src/client/manifest.ts`](../../packages/client/modules/src/client/manifest.ts)

## wire

رسم هو Node نصف و متصفح نصف بين بروتوكول طبقة وحيد حق مصدر. مضيف من مسح إلى حزمة تركيب خروج `WebBootEntry` سطر و `WebBootBatch` وصف، مع بعد في Vite entry قبل نحو بنية تحويل index حقن جدول مساهمة registration facade،application preload،bootstrap نص برمجي و رسم عام كمية.`global` سطر تصيير لـ `globalThis["__DSH_BOOT__"]`، منها `<` قد تحويل معنى، إضافة يمكن تحكم نص لذلك لا يمكن هروب خروج script عنصر عنصر. لا يوجد صالح manifest صفحة لا يمكن بدء: متصفح محلل سوف رفض شاذ شكل row أو دفعة مرة، لم معرفة عضو، و لم تماما جيد ملكية واحد ابتدائي combo وصف entry.

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

كل ابتدائي row `rev` كل هو لا نفاذ واضح عملية nonce إضافة ترتيب رقم، لذلك تركيب رسم وقت لن ها أمل كل إضافة ناتج.HMR مراقبة إلى bundle تغير بعد، هذا row revision عندئذ تعديل لـ جديد يمكن تنفيذ بايت ها أمل. ابتدائي descriptor يأخذ row تخطيط دخول bootstrap و application اثنان عدد ضبط درجة مرحلة مقطع، كل مرحلة مقطع كل يمكن يتضمن كثير بند descriptor.URL فقط يحتوي لديه ترتيب package مورد قائمة و من هذه row revision إرسال توليد revision، مرحلة مقطع اسم لن دخول توجيه. رسم تركيب إبقاء row ترتيب، و في map شكل صيغة URL تجاوز مرور 3 KiB قبل طمع قلب قطع قسم، لا تجميع وصل نص برمجي، أيضا لا قراءة map. رسم revision مقابل entry و batch descriptor طلب ها أمل.`immediately` علامة رقم واحد مرحلة مقطع registration barrier؛ نفس combo في row مشترك نص برمجي نقل، مختلف combo فإن مستقل تحميل.

## مسح

حزمة إضافة دخول هذا ورقة جدول طريقة، هو في ذاتي ذات package.json في إعلان `dsh.client`(`platform: 'web'`، اختياري `inject` حافة، اختياري `immediately`) ، و في `exports["./client"]` توجيه خروج بناء جيد bundle. كل live row كل من ذاتي ذات Loader specifier و الذي تابع tree `baseUrl` تحليل؛ إذا `loader.internal.resolveSync` متاح، فإن استخدام Host face import الذي استخدام نفس عدد تنفيذ. الأكثر قريب ملكية package manifest توفير متصفح وحدة id، لذلك متبادل مقابل source و built overlay ما زال إبقاء حزمة هوية. إذا مختلف active Loader source تحليل إلى نفس حزمة اسم، تركيب سوف فشل؛ واحد مصدر إزالة بعد، ما زال تخزين نشط مصدر بلا حاجة إعادة بدء fiber يكفي توفير هذا row.

مسح هو مفرد حزمة زيادة كمية؛ لا وجود كل كمية إعادة مسح شفرة مسار.fiber بنية صنع أو dispose(مورد تحرير) وقت كل مرة cordis `internal/plugin` إرسال إطلاق كل يأخذ هذا fiber entry اسم علامة قذر، مرة دقيق مهمة flush يأخذ كل قذر اسم و فوري loader entry مقابل حساب. تنشيط مرة بـ الكل حالي entry ملء دخول نفس عدد قذر تجميع دمج تزامن flush، لذلك أول مسح و مستقر حالة مشترك واحد بند تنفيذ——لكن فشل وضع حالة متبادل عكس. تنشيط وقت، قد تحميل entry في شاذ شكل إعلان أو ناقص bundle سوف تجمع دمج لـ واحد كبير صوت `AggregateError`، صف خروج كل ضرر تالف حزمة: هذا fiber دخول FAILED، من بدء كبير صوت فشل sweep فوق تقرير. مستقر حالة تحت، ضرر تالف حزمة فقط سجل واحد بند تحذير إبلاغ، كما لا نيل ضرر و أخرى حزمة.

حزمة بيانات وصفية——يشمل «غير client حزمة» هذا واحد لا تحديد ربط نقاش——حسب Loader specifier و الذي تابع tree base URL ذاكرة مؤقتة حتى إعادة بدء. نفس مصدر fiber إعادة بدء سوف أصل مثال إعادة استخدام ذلك row و rev؛bundle محتوى تغيير فقط مرور `rebuilt()` وصول رسم.

## bundle توجيه و index حقن

`GET`/`HEAD /plugins/??<package-a>/client.js,<package-b>/client.js&rev=<rev>` بحث عنوان واحد نسخة توليد combo نص برمجي؛ مفرد مورد طلب اعتماد نفس شكل صيغة، أيضا هو HMR مسار. نص برمجي في أول مرة `GET` وقت فقط تجميع وصل مرة، و بـ قطعا مقابل `sourceMappingURL` ربط ذيل، منها كل مورد بعد لاحقة تعديل لـ `.js.map`. بدء،index تصيير، نص برمجي `GET` و `HEAD` كل لن قراءة map ملف؛ أول مرة map `GET` عندئذ سوف قراءة و تحقق هذه ملف، تركيب واحد نسخة Indexed Source Map v3، و ذاكرة مؤقتة هذا body. مكون لديه ذاتي حمل map وقت مباشر لأجل مقابل section؛ لا يوجد وقت فإن نيل نيل identity section، ذلك `sourcesContent` هو التقاط bundle،source اسم أخذ تحزيم بعد `sourceURL` أو إضافة توجيه. كل بند بدء طلب URL حسب UTF-8 بايت حساب حساب كل لا تجاوز مرور 3 KiB؛ قطع قسم حسب أكثر طويل map شكل صيغة حساب حساب. كل application URL كل سوف مسبق تحميل، كل bootstrap URL كل سوف في رسم عام كمية و Vite entry قبل تنفيذ. قد شيء تحويل استجابة استخدام طويل مدة immutable ذاكرة مؤقتة. لم معرفة أو يتم تعديل مورد قائمة، نقص قليل revision و قديم قديم revision كل إرجاع 404، أبدا توفير أخرى بايت، أيضا لن يجعل SPA fallback يأخذ HTML عند عمل JavaScript إرجاع؛ أخرى طريقة إرجاع 405. حقن سطر في كل مرة index تصيير وقت يحمل حالي رسم، لذلك إعادة تحميل مجموع هو أساس في فوري تركيب بدء.

## خدمة

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

`ClientModuleRegistry`(`ctx.clientModules`، تعريف في [`packages/client/modules/src/index.ts`](../../packages/client/modules/src/index.ts)) كشف قراءة وجه و إعادة بناء وجه؛ توقيع رؤية توليد[خدمة دليل](#ctxclientmodules--clientmoduleregistry).`graph()` إرجاع حالي تركيب خروج رسم (اثنان مرة تغيير بين هو نفس عدد مستقر كائن) ،`clientPath(id)` إرجاع bundle قطعا مقابل مسار،`artifactBaseline(id)` إرجاع قراءة حالي لقطة قبل التقاط bundle stat قيمة.`fetchBundle()` تحليل HTTP توجيه الذي استخدام نفس نسخة كسول صفة استجابة.`rebuilt(id)` هو تغير بعد bundle محتوى وصول رسم وحيد مدخل: هو إعادة ها أمل bundle بايت، فقط لديه revision حق صحيح تغير عندئذ سوف إعادة تركيب رسم تزامن خروج إشعار.`onRebuilt` حسب حدوث تغير bundle تدريجي عدد إطلاق و يحمل جديد revision؛`onGraphChanged` في أي مرة إعادة تركيب رسم flush بعد إطلاق (سطر زيادة حذف، أو rebuilt حمل قدوم revision تغير) ، و اعتماد سحب أخذ نموذج——مستمع ذاتي سطر إعادة قراءة `graph()`. اثنان بند إشعار مسار كل سوف التقاط إقامة مستمع استثناء، لذلك واحد رمي خطأ حجز قراءة من حيث لا يستطيع يجعل لاحق حجز قراءة من يتم قفز مرور، أيضا لا يستطيع قتل ميت إطلاق هذا مرة flush واحد جهة.

مع حزمة توفير Web تركيب عبر [`dsh-client-hmr`](../../packages/client/hmr/README.zh.md) تسليم حركة حالة رسم لقطة.Host قيام أي تحويل اكتشاف لديه رسم تغير إشعار، إعادة وصل سوف إرسال حالي كامل رسم. رسم وصف متصفح هدف بند، لا إعلان Host تنظيف قد إتمام. ناتج جولة استفسار آخر خارج تقرير إبلاغ إعادة بناء revision. فقط source map تغير لن إطلاق إعادة تحميل؛ جديد combo-map URL فقط سوف في bundle revision تغير بعد ظهور، كل نسخة map body من ذلك أول مرة `GET` ثابت.Client Modules تحقق لقطة، و سوف مقابل حساب و إعادة بناء سلسلة سطر تنسيق ضبط؛ هو يحتفظ بدء إنشاء بند خريطة، مسؤول مفرد مورد وصول، مختلف خطوة إزالة، لم استخدام وحدة و مثال صيغة تنظيف، و صفحة محلي إعادة محاولة حالة. ساكن حالة منصة وحدة و bootstrap إبقاء صفحة دورة الحياة؛Electron تثبيت يخص مستقل مسار.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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
